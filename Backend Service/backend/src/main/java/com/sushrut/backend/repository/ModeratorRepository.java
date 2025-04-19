package com.sushrut.backend.repository;

import com.sushrut.backend.entity.Moderator;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ModeratorRepository extends JpaRepository<Moderator, String> {
    Optional<Moderator> findByUsername(String username);
}