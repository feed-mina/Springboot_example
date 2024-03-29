package kr.so.configuration.servlet.handler;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.method.HandlerMethod;
import org.springframework.web.servlet.handler.HandlerInterceptorAdapter;

import kr.so.configuration.exception.BaseException;
import kr.so.configuration.http.BaseResponseCode;
import kr.so.framework.data.web.RequestConfig;
public class BaseHandlerInterceptor extends HandlerInterceptorAdapter {

	
	Logger logger = LoggerFactory.getLogger(getClass());
	@Override
	  public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
	  	logger.info("preHandle requestURI : {}", request.getRequestURI());
	  	if (handler instanceof HandlerMethod) {
	  		HandlerMethod handlerMethod = (HandlerMethod) handler;
	  		logger.info("handler Method : {}", handlerMethod);
	  		RequestConfig requestConfig = 
	  		  		handlerMethod.getMethodAnnotation(RequestConfig.class);
	  		if (requestConfig != null) {
	  			if (requestConfig.loginCheck()) {
	  				
	  				// 로그인 체크가 필수인 경우
	  				throw new BaseException(BaseResponseCode.LOGIN_REQUIRED, new String[] {request.getRequestURI()});
	  			}
	  		}
	  	}
	  	return true;
	  }
	
/*
 * 
import kr.so.mvc.domain.MenuType;

	  @Override
	  public void postHandle(HttpServletRequest request, HttpServletResponse response, Object handler,
	  		ModelAndView modelAndView) throws Exception {
		  if(handler instanceof HandlerMethod) {
			  if(modelAndView != null) {

				  modelAndView.addObject("menuTypes", MenuType.values());  
			  }
		  }
	  	logger.info("postHandle requestURI : {}", request.getRequestURI());
	  }
 */
}