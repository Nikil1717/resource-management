package com.resourcehub.resourcemanagement.excel;

import com.resourcehub.resourcemanagement.entity.Resource;
import com.resourcehub.resourcemanagement.repository.ResourceRepository;

import org.apache.poi.ss.usermodel.*;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.InputStream;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.ZoneId;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.CellType;
import org.apache.poi.ss.usermodel.DateUtil;
import java.util.*;

@Service
public class ExcelImportService {

    private final ResourceRepository resourceRepository;

    private static final List<String> REQUIRED_COLUMNS = List.of(
            "Employee Code",
            "Employee Name",
            "Project Code",
            "Project Name",
            "Allocation",
            "FTE",
            "Customer Code",
            "Customer Name",
            "ProjectDUName",
            "ProjectManagerName",
            "Project Category",
            "ProjectCategoryName",
            "WBS Type",
            "BillingStatus",
            "EmployeeLOBName",
            "Band",
            "SubBand",
            "JoiningDate",
            "PSA"
    );

    public ExcelImportService(ResourceRepository resourceRepository) {
        this.resourceRepository = resourceRepository;
    }

    public int importExcel(MultipartFile file) {

        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("Excel file is empty.");
        }

        String filename = file.getOriginalFilename();

        if (filename == null ||
                (!filename.endsWith(".xlsx") && !filename.endsWith(".xls"))) {

            throw new IllegalArgumentException(
                    "Only Excel files (.xlsx or .xls) are supported."
            );
        }

        try (InputStream inputStream = file.getInputStream();
             Workbook workbook = WorkbookFactory.create(inputStream)) {

            Sheet sheet = workbook.getSheetAt(0);

            if (sheet.getPhysicalNumberOfRows() == 0) {
                throw new IllegalArgumentException("Excel sheet is empty.");
            }

            Row headerRow = sheet.getRow(0);

            if (headerRow == null) {
                throw new IllegalArgumentException("Excel header row not found.");
            }

            Map<String, Integer> columnIndexes = findColumns(headerRow);

            List<Resource> resources = new ArrayList<>();

            for (int rowIndex = 1;
                 rowIndex <= sheet.getLastRowNum();
                 rowIndex++) {

                Row row = sheet.getRow(rowIndex);

                if (row == null || isEmptyRow(row)) {
                    continue;
                }

                Resource resource = convertRowToResource(
                        row,
                        columnIndexes,
                        rowIndex + 1
                );

                resources.add(resource);
            }

            resourceRepository.saveAll(resources);

            return resources.size();

        } catch (IllegalArgumentException exception) {
            throw exception;

        } catch (Exception exception) {
            throw new RuntimeException(
                    "Failed to import Excel file: " + exception.getMessage(),
                    exception
            );
        }
    }

    private Map<String, Integer> findColumns(Row headerRow) {

        Map<String, Integer> columnIndexes = new HashMap<>();

        for (Cell cell : headerRow) {

            String header = getCellStringValue(cell);

            if (header != null) {
                header = header.trim();

                if (REQUIRED_COLUMNS.contains(header)) {
                    columnIndexes.put(header, cell.getColumnIndex());
                }
            }
        }

        List<String> missingColumns = new ArrayList<>();

        for (String requiredColumn : REQUIRED_COLUMNS) {

            if (!columnIndexes.containsKey(requiredColumn)) {
                missingColumns.add(requiredColumn);
            }
        }

        if (!missingColumns.isEmpty()) {
            throw new IllegalArgumentException(
                    "Missing required Excel columns: " + missingColumns
            );
        }

        return columnIndexes;
    }

    private Resource convertRowToResource(
            Row row,
            Map<String, Integer> columns,
            int excelRowNumber) {

        try {

            Resource resource = new Resource();

            resource.setEmployeeCode(
                    getString(row, columns, "Employee Code")
            );

            resource.setEmployeeName(
                    getString(row, columns, "Employee Name")
            );

            resource.setProjectCode(
                    getString(row, columns, "Project Code")
            );

            resource.setProjectName(
                    getString(row, columns, "Project Name")
            );

            resource.setAllocation(
                    getInteger(row, columns, "Allocation")
            );

            resource.setFte(
                    getBigDecimal(row, columns, "FTE")
            );

            resource.setCustomerCode(
                    getString(row, columns, "Customer Code")
            );

            resource.setCustomerName(
                    getString(row, columns, "Customer Name")
            );

            resource.setProjectDUName(
                    getString(row, columns, "ProjectDUName")
            );

            resource.setProjectManagerName(
                    getString(row, columns, "ProjectManagerName")
            );

            resource.setProjectCategory(
                    getString(row, columns, "Project Category")
            );

            resource.setProjectCategoryName(
                    getString(row, columns, "ProjectCategoryName")
            );

            resource.setWbsType(
                    getString(row, columns, "WBS Type")
            );

            resource.setBillingStatus(
                    getString(row, columns, "BillingStatus")
            );

            resource.setEmployeeLOBName(
                    getString(row, columns, "EmployeeLOBName")
            );

            resource.setBand(
                    getString(row, columns, "Band")
            );

            resource.setSubBand(
                    getString(row, columns, "SubBand")
            );

            resource.setJoiningDate(
                    getLocalDate(row, columns, "JoiningDate")
            );

            resource.setPsa(
                    getString(row, columns, "PSA")
            );

            return resource;

        } catch (Exception exception) {

            throw new IllegalArgumentException(
                    "Error processing Excel row "
                            + excelRowNumber
                            + ": "
                            + exception.getMessage(),
                    exception
            );
        }
    }

    private String getString(
            Row row,
            Map<String, Integer> columns,
            String columnName) {

        Integer columnIndex = columns.get(columnName);

        if (columnIndex == null) {
            return null;
        }

        Cell cell = row.getCell(columnIndex);

        return getCellStringValue(cell);
    }

    private Integer getInteger(
            Row row,
            Map<String, Integer> columns,
            String columnName) {

        Integer columnIndex = columns.get(columnName);

        if (columnIndex == null) {
            return null;
        }

        Cell cell = row.getCell(columnIndex);

        if (cell == null) {
            return null;
        }

        if (cell.getCellType() == CellType.NUMERIC) {
            return (int) cell.getNumericCellValue();
        }

        String value = getCellStringValue(cell);

        if (value == null || value.isBlank()) {
            return null;
        }

        return Integer.valueOf(value.trim());
    }

    private BigDecimal getBigDecimal(
            Row row,
            Map<String, Integer> columns,
            String columnName) {

        Integer columnIndex = columns.get(columnName);

        if (columnIndex == null) {
            return null;
        }

        Cell cell = row.getCell(columnIndex);

        if (cell == null) {
            return null;
        }

        if (cell.getCellType() == CellType.NUMERIC) {
            return BigDecimal.valueOf(cell.getNumericCellValue());
        }

        String value = getCellStringValue(cell);

        if (value == null || value.isBlank()) {
            return null;
        }

        return new BigDecimal(value.trim());
    }

    private LocalDate getLocalDate(
            Row row,
            Map<String, Integer> columns,
            String columnName) {

        Cell cell = row.getCell(columns.get(columnName));

        if (cell == null || cell.getCellType() == CellType.BLANK) {
            return null;
        }

        // Actual Excel date cell
        if (cell.getCellType() == CellType.NUMERIC) {

            if (DateUtil.isCellDateFormatted(cell)) {
                return cell.getLocalDateTimeCellValue().toLocalDate();
            }

            return null;
        }

        String value = cell.toString().trim();

        if (value.isBlank()) {
            return null;
        }

        // Example: 2002-09-19
        try {
            return LocalDate.parse(value);
        } catch (DateTimeParseException ignored) {
        }

        // Example: 2002-09-19T00:00:00
        try {
            return LocalDateTime.parse(value).toLocalDate();
        } catch (DateTimeParseException ignored) {
        }

        throw new IllegalArgumentException(
                "Invalid JoiningDate value: " + value
        );
    }

    private String getCellStringValue(Cell cell) {

        if (cell == null) {
            return null;
        }

        DataFormatter formatter = new DataFormatter();

        String value = formatter.formatCellValue(cell);

        if (value == null || value.isBlank()) {
            return null;
        }

        return value.trim();
    }

    private boolean isEmptyRow(Row row) {

        for (Cell cell : row) {

            if (cell != null &&
                    cell.getCellType() != CellType.BLANK &&
                    !getCellStringValue(cell).isBlank()) {

                return false;
            }
        }

        return true;
    }
}