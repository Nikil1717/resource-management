package com.resourcehub.resourcemanagement.controller;

import com.resourcehub.resourcemanagement.excel.ExcelImportService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

@RestController
@RequestMapping("/api/import")
@CrossOrigin(origins = "http://localhost:5173")
public class ExcelImportController {

    private final ExcelImportService excelImportService;

    public ExcelImportController(
            ExcelImportService excelImportService) {

        this.excelImportService = excelImportService;
    }

    @PostMapping("/excel")
    public ResponseEntity<Map<String, Object>> importExcel(
            @RequestParam("file") MultipartFile file) {

        int importedRecords =
                excelImportService.importExcel(file);

        return ResponseEntity.ok(
                Map.of(
                        "message", "Excel imported successfully",
                        "recordsImported", importedRecords
                )
        );
    }
}