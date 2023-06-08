package kr.so.java.mvc.controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;

import io.swagger.annotations.ApiOperation;
import kr.so.java.configuration.GlobalConfig;
import kr.so.java.configuration.http.BaseResponse;

public class FileController {

	Logger logger = LoggerFactory.getLogger(getClass());
	
	@Autowired
	private GlobalConfig config;
	
	@GetMapping
	@ApiOperation(value="업로드", notes = "")
	public BaseResponse<Boolean> save(){
		return new BaseResponse<Boolean>(true);
	} 
}
