package kr.so.configuration;

import org.aspectj.lang.annotation.Aspect;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import kr.so.mvc.service.CommonService;

@Aspect
@Component

public class UserLoginAopConfig {
    Logger logger = LoggerFactory.getLogger(UserLoginAopConfig.class);

    @Autowired
    CommonService commonService;

    @Autowired
    kr.so.configuration.security.JwtTokenProvider JwtTokenProvider;
}
