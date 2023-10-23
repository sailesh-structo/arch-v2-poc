package com.structo.core;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;

public class JobMessage {
    private String jobId;
    private String filePath;    
    private String machineId;


    @JsonCreator
    public JobMessage(@JsonProperty("jobId") String jobId, @JsonProperty("filePath") String filePath, @JsonProperty("machineId") String machineId) {
        this.jobId = jobId;
        this.filePath = filePath;       
        this.machineId = machineId;

    }

    public String getJobId() {
        return jobId;
    }

    public String getFilePath() {
        return filePath;
    }

    public String getMachineId() {
        return machineId;
    }

}
