package com.resourcehub.resourcemanagement.repository;

import com.resourcehub.resourcemanagement.entity.Resource;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ResourceRepository extends JpaRepository<Resource, Long> {

}