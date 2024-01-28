package kr.so.configuration.security;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.stereotype.Component;

import kr.so.util.CommonResponse;
import kr.so.util.JSONObject;

@Component 
public class CustomAuthenticationEntryPoint implements AuthenticationEntryPoint{
	@Override
	public void commence(HttpServletRequest request, HttpServletResponse response, AuthenticationException ex)
			throws IOException {
		response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
		response.setContentType("application/json");
		response.setCharacterEncoding("UTF-8");
        
        Map<String, Object> paramMap = new HashMap<String, Object>();
        paramMap.put("authError",true);

        ResponseEntity<?> resEntity = CommonResponse.statusResponse(HttpServletResponse.SC_UNAUTHORIZED, paramMap);
        
        JSONObject jsonObject = new JSONObject();
        jsonObject.putAll((Map) resEntity.getBody());
        response.getWriter().write(jsonObject.toString());

            }
}