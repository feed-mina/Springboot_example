package kr.so.mvc.controller;

import java.util.HashMap;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import io.swagger.v3.oas.annotations.parameters.RequestBody;


@Controller
@RequestMapping("/example/parameter")
public class ExampleParameterController {
	
	Logger logger = LoggerFactory.getLogger(getClass());

	@GetMapping("/example1")
	public void example1(@RequestParam String id, @RequestParam String code, Model model) {
		model.addAttribute("id", id);
		model.addAttribute("code", code);
	}
	
	// Map을 활용한 파라메터 받는방법
	@GetMapping("/example2")
	public void example2(@RequestParam Map<String, Object> paramMap, Model model) {
		model.addAttribute("paramMap", paramMap); 
	}
	
	// Class를 활용한 파라메터 받는방법
	@GetMapping("/example3")
	public void example3(ExampleParameter paramter, Model model) {
		model.addAttribute("paramter", paramter); 
	}

	// @PathVariable - Class 활용한 파라메터
	// ex ) http://localhost:8080/example/parameter/example4/test123/b1
	@GetMapping("/example4/{id}/{code}")
	public String example4(@PathVariable String id, @PathVariable String code, Model model) {
		model.addAttribute("id", id); 
		model.addAttribute("code", code); 
		return "/example/parameter/example4";
	}
	@GetMapping("/example5/")
	public String example5(HttpServletRequest request, Model model) {
		model.addAttribute("ids", request.getParameterValues("ids"));  
		return "/example/parameter/example5";
	}
	
	
	// json 받는 방법
	@GetMapping("/example6/form")
	public void form() {
		
	}
	/* 
	@PostMapping("/example6/saveData")
	@ResponseBody
	public Map<String, Object> example6(@RequestBody Map<String, Object> requestBody) {
		Map<String, Object> resultMap = new HashMap<String, Object>();
		resultMap.put("result",true);
		logger.info("requestBody : {}", requestBody);
		return resultMap;
	}
	* */ 
	 
	// json 받는 방법


	@PostMapping("/example6/saveData")
	@ResponseBody
	public Map<String, Object> example6(@RequestBody ExampleRequestBodyUser requestBody) {
		Map<String, Object> resultMap = new HashMap<String, Object>();
		resultMap.put("result",true);
		logger.info("requestBody : {}", requestBody);
		return resultMap;
	}

}
