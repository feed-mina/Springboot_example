package kr.so.configuration.web.bind.annotation;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.MessageSource;
import org.springframework.http.HttpStatus;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.context.request.WebRequest;

import kr.so.configuration.exception.BaseException;
import kr.so.configuration.http.BaseResponse;

@ControllerAdvice
public class BaseControllerAdvice {

	@Autowired
	private MessageSource messageSource;
	
	@ExceptionHandler(value= {BaseException.class})
	@ResponseStatus(HttpStatus.OK)
	@ResponseBody
	
	private BaseResponse<?> handleBaseException(BaseException e, WebRequest request){
		return new BaseResponse<String>(e.getResponseCode(), messageSource.getMessage(e.getResponseCode().name(), e.getArgs(), null));
	}

	@ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    public String handleException(Exception e, Model model) {
        model.addAttribute("timestamp", System.currentTimeMillis());
        model.addAttribute("status", HttpStatus.INTERNAL_SERVER_ERROR.value());
        model.addAttribute("error", "Internal Server Error");
        model.addAttribute("message", e.getMessage());
        model.addAttribute("path", "/error");
        return "error";
    }

}
