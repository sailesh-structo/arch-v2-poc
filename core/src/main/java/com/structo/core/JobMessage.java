package com.structo.core;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;

public class JobMessage {
    private String jobId;
    private String filePath;

    @JsonCreator
    public JobMessage(@JsonProperty("jobId") String jobId, @JsonProperty("filePath") String filePath) {
        this.jobId = jobId;
        this.filePath = filePath;
    }

    public String getJobId() {
        return jobId;
    }

    public String getFilePath() {
        return filePath;
    }

}
