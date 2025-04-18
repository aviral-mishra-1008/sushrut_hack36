from utils.reportTables2Text import pathology_reports

report = pathology_reports()
pdf_path = "assets/sample2.pdf"
final_df = report.get_valid_tables(pdf_path)

if final_df is not None:
    cleaned_df = report.clean_by_cell_length(final_df)    
    natural_text = report.to_natural_language(cleaned_df)
    cleaned_df.to_csv("assets/out_test_reportTables2Text.csv", index=False)
    with open("assets/reportTables2Text2.txt", "w") as f:
        f.write(natural_text)