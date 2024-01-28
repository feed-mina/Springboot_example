package kr.so.configuration.security;

import java.io.IOException;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;

public class JwtAuthenticationFilter extends OncePerRequestFilter{
    private final JwtTokenProvider jwtTokenProvider;

    // JWT Provider 주입
    public JwtAuthenticationFilter(JwtTokenProvider jwtTokenProvider){
        this.jwtTokenProvider = jwtTokenProvider;
    }

    // Request 로 들어오는 JWT Token의 유효성을 검증(jwtTokenProvider.validationToken) 하는 filter를 filterChain에 등록한다.


    @Override 
    public void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws IOException, ServletException{
        String token = jwtTokenProvider.resolveToken(request); // token을 가져옴 

        if((token != null) && jwtTokenProvider.validateToken(token)){
            Authentication auth = jwtTokenProvider.getAuthentication(token);
            SecurityContextHolder.getContext().setAuthentication(auth);
        }

        filterChain.doFilter(request, response);
    }
}