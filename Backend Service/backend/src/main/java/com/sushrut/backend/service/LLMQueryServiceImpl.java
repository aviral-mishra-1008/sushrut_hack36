package com.sushrut.backend.service;

import com.sushrut.backend.dto.DoctorListItemDTO;
import com.sushrut.backend.dto.LLMRequest;
import com.sushrut.backend.dto.LLMResponse;
import com.sushrut.backend.dto.LLMResponseToFrontend;
import com.sushrut.backend.entity.Doctor;
import com.sushrut.backend.exception.LLMServiceException;
import com.sushrut.backend.mapper.DoctorToDTOMapper;
import com.sushrut.backend.repository.DoctorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.List;

@Service
public class LLMQueryServiceImpl implements LLMQueryService{
    private final RestTemplate restTemplate; //rest template is used to make the request to the LLM which is running on the python backend
    private final DoctorRepository doctorRepository;
    private final DoctorToDTOMapper doctorToDTOMapper;

    public LLMQueryServiceImpl(RestTemplate restTemplate, DoctorRepository doctorRepository, DoctorToDTOMapper doctorToDTOMapper) {
        //Preferred over field injections as a better practice, because:
                /*
                    Basically constructor injections are safer, more predictable and less prone to failure
                    If a dependency is missing it can be figured out at the beginning and also this is thread safe
                    field injections throw NullPointerExceptions (The pointer being a null pointer) and this happens
                    when dependency is not properly injected
                    Lastly, field injections are not preferred because they are known to lead to unexpected behaviour
                    as you might autowire a dependency randomly, while the constructor injection promotes loose coupling

                 */

        this.restTemplate = restTemplate;
        this.doctorRepository = doctorRepository;
        this.doctorToDTOMapper = doctorToDTOMapper;
    }

    @Value("${llm.server.url}")
    private String LLMServerURL;

    @Override
    public LLMResponseToFrontend queryLLM(LLMRequest request){
        try{
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            HttpEntity<LLMRequest> entity = new HttpEntity<>(request,headers);

            LLMResponse response = restTemplate.postForObject(
                    LLMServerURL+"/query",
                    entity,
                    LLMResponse.class);

            if(response==null || response.getDepartment()==null){
                throw new LLMServiceException("LLM query failed! response is null or department is null");
            }

            //fetching the list of doctors
            List<Doctor> doctors = doctorRepository.findByDepartmentIgnoreCase(response.getDepartment());
            List<DoctorListItemDTO> doctorDTOs = doctorToDTOMapper.toDoctorDTOList(doctors);

            return LLMResponseToFrontend.builder()
                    .department(response.getDepartment())
                    .description(response.getDescription())
                    .doctors(doctorDTOs)
                    .totalResults(doctorDTOs.size())
                    .build();


        } catch(Exception e){
            throw new LLMServiceException("Failed to get the output from the Server running LLM"+e.getMessage());
            /*
                In case, there is some problem with the Python end, the normal RunTimeException of Java won't tell a thing
                Thus, we define a custom exception to know the error is from the LLM and thus we can check the LLM Side
                Also, since it will certainly happen at the RunTime, the custom exception class extends the RuntimeException class and just passes the message
                Sent here to the super i.e the parent class implementation i.e Runtime Exception is thrown but the message is changed using this custom setup
             */
        }
    }

}
