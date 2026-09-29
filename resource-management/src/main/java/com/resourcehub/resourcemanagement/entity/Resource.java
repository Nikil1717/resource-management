package com.resourcehub.resourcemanagement.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "resource")
public class Resource {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "employee_code")
    private String employeeCode;

    @Column(name = "employee_name")
    private String employeeName;

    @Column(name = "project_code")
    private String projectCode;

    @Column(name = "project_name")
    private String projectName;

    @Column(name = "allocation")
    private Integer allocation;

    @Column(name = "fte")
    private BigDecimal fte;

    @Column(name = "customer_code")
    private String customerCode;

    @Column(name = "customer_name")
    private String customerName;

    @Column(name = "project_du_name")
    private String projectDUName;

    @Column(name = "project_manager_name")
    private String projectManagerName;

    @Column(name = "project_category")
    private String projectCategory;

    @Column(name = "project_category_name")
    private String projectCategoryName;

    @Column(name = "wbs_type")
    private String wbsType;

    @Column(name = "billing_status")
    private String billingStatus;

    @Column(name = "employee_lob_name")
    private String employeeLOBName;

    @Column(name = "band")
    private String band;

    @Column(name = "sub_band")
    private String subBand;

    @Column(name = "joining_date")
    private LocalDate joiningDate;

    @Column(name = "psa")
    private String psa;

    public Resource() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getEmployeeCode() {
        return employeeCode;
    }

    public void setEmployeeCode(String employeeCode) {
        this.employeeCode = employeeCode;
    }

    public String getEmployeeName() {
        return employeeName;
    }

    public void setEmployeeName(String employeeName) {
        this.employeeName = employeeName;
    }

    public String getProjectCode() {
        return projectCode;
    }

    public void setProjectCode(String projectCode) {
        this.projectCode = projectCode;
    }

    public String getProjectName() {
        return projectName;
    }

    public void setProjectName(String projectName) {
        this.projectName = projectName;
    }

    public Integer getAllocation() {
        return allocation;
    }

    public void setAllocation(Integer allocation) {
        this.allocation = allocation;
    }

    public BigDecimal getFte() {
        return fte;
    }

    public void setFte(BigDecimal fte) {
        this.fte = fte;
    }

    public String getCustomerCode() {
        return customerCode;
    }

    public void setCustomerCode(String customerCode) {
        this.customerCode = customerCode;
    }

    public String getCustomerName() {
        return customerName;
    }

    public void setCustomerName(String customerName) {
        this.customerName = customerName;
    }

    public String getProjectDUName() {
        return projectDUName;
    }

    public void setProjectDUName(String projectDUName) {
        this.projectDUName = projectDUName;
    }

    public String getProjectManagerName() {
        return projectManagerName;
    }

    public void setProjectManagerName(String projectManagerName) {
        this.projectManagerName = projectManagerName;
    }

    public String getProjectCategory() {
        return projectCategory;
    }

    public void setProjectCategory(String projectCategory) {
        this.projectCategory = projectCategory;
    }

    public String getProjectCategoryName() {
        return projectCategoryName;
    }

    public void setProjectCategoryName(String projectCategoryName) {
        this.projectCategoryName = projectCategoryName;
    }

    public String getWbsType() {
        return wbsType;
    }

    public void setWbsType(String wbsType) {
        this.wbsType = wbsType;
    }

    public String getBillingStatus() {
        return billingStatus;
    }

    public void setBillingStatus(String billingStatus) {
        this.billingStatus = billingStatus;
    }

    public String getEmployeeLOBName() {
        return employeeLOBName;
    }

    public void setEmployeeLOBName(String employeeLOBName) {
        this.employeeLOBName = employeeLOBName;
    }

    public String getBand() {
        return band;
    }

    public void setBand(String band) {
        this.band = band;
    }

    public String getSubBand() {
        return subBand;
    }

    public void setSubBand(String subBand) {
        this.subBand = subBand;
    }

    public LocalDate getJoiningDate() {
        return joiningDate;
    }

    public void setJoiningDate(LocalDate joiningDate) {
        this.joiningDate = joiningDate;
    }

    public String getPsa() {
        return psa;
    }

    public void setPsa(String psa) {
        this.psa = psa;
    }
}