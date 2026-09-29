package com.resourcehub.resourcemanagement.service;

import com.resourcehub.resourcemanagement.entity.Resource;
import com.resourcehub.resourcemanagement.repository.ResourceRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ResourceService {

    private final ResourceRepository resourceRepository;

    public ResourceService(ResourceRepository resourceRepository) {
        this.resourceRepository = resourceRepository;
    }

    public List<Resource> getAllResources() {
        return resourceRepository.findAll();
    }

    public Resource getResourceById(Long id) {
        return resourceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Resource not found with id: " + id));
    }

    public Resource createResource(Resource resource) {
        return resourceRepository.save(resource);
    }

    public Resource updateResource(Long id, Resource updatedResource) {

        Resource existingResource = resourceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Resource not found with id: " + id));

        existingResource.setEmployeeCode(updatedResource.getEmployeeCode());
        existingResource.setEmployeeName(updatedResource.getEmployeeName());
        existingResource.setProjectCode(updatedResource.getProjectCode());
        existingResource.setProjectName(updatedResource.getProjectName());
        existingResource.setAllocation(updatedResource.getAllocation());
        existingResource.setFte(updatedResource.getFte());
        existingResource.setCustomerCode(updatedResource.getCustomerCode());
        existingResource.setCustomerName(updatedResource.getCustomerName());
        existingResource.setProjectDUName(updatedResource.getProjectDUName());
        existingResource.setProjectManagerName(updatedResource.getProjectManagerName());
        existingResource.setProjectCategory(updatedResource.getProjectCategory());
        existingResource.setProjectCategoryName(updatedResource.getProjectCategoryName());
        existingResource.setWbsType(updatedResource.getWbsType());
        existingResource.setBillingStatus(updatedResource.getBillingStatus());
        existingResource.setEmployeeLOBName(updatedResource.getEmployeeLOBName());
        existingResource.setBand(updatedResource.getBand());
        existingResource.setSubBand(updatedResource.getSubBand());
        existingResource.setJoiningDate(updatedResource.getJoiningDate());
        existingResource.setPsa(updatedResource.getPsa());

        return resourceRepository.save(existingResource);
    }

    public void deleteResource(Long id) {

        if (!resourceRepository.existsById(id)) {
            throw new RuntimeException("Resource not found with id: " + id);
        }

        resourceRepository.deleteById(id);
    }
}