package kr.so.java.configuration;

import java.util.Properties;

import javax.annotation.PostConstruct;

import org.apache.commons.lang3.ObjectUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationContext;
import org.springframework.core.io.Resource;
import org.springframework.core.io.ResourceLoader;
import org.springframework.core.io.support.PropertiesLoaderUtils;

public class GlobalConfig {

	final Logger logger = LoggerFactory.getLogger(getClass());
	
	@Autowired 
	private ApplicationContext context;
	
	@Autowired
	private ResourceLoader resourceLoader;
	
	private String uploadFilePath;
	private String schedulerCronExample1;
	
	private boolean local;
	private boolean dev;
	private boolean prod;
	
	@PostConstruct
	public void init() {
		logger.info("init");
		String[] activeProfiles = context.getEnvironment().getActiveProfiles();
		String activeProfile = "local";
		if(ObjectUtils.isNotEmpty(activeProfiles)) {

			activeProfile = activeProfiles[0];
		}
		String resourcePath = String.format("classpath:globals/global-%s.properties", activeProfile);
		try {
			Resource resource = resourceLoader.getResource(resourcePath);
			Properties properties = PropertiesLoaderUtils.loadProperties(resource);
			this.uploadFilePath = properties.getProperty("uploadFile.path");
			this.schedulerCronExample1 = properties.getProperty("scheduler.cron.example1");
			this.dev = activeProfile.equals("dev");
			this.local = activeProfile.equals("local");
			this.prod = activeProfile.equals("prod");
			
		} catch (Exception e) {
			logger.error("e", e);
		}		
	}
	
	public String getUploadFilePath() {
		return uploadFilePath;
	}

	public String getSchedulerCronExample1() {
		return schedulerCronExample1;
	}
	
	public boolean isLocal() {
		return local;
	}
	public boolean isDev() {
		return dev;
	}
	public boolean isProd() {
		return prod;
	}
}
