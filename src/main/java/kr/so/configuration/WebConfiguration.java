package kr.so.configuration;

import java.util.List;
import java.util.Locale;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import org.apache.commons.io.IOUtils;
import org.aspectj.lang.annotation.SuppressAjWarnings;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.support.ReloadableResourceBundleMessageSource;
import org.springframework.core.MethodParameter;
import org.springframework.format.FormatterRegistry;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.AuthenticationCredentialsNotFoundException;
import org.springframework.web.bind.support.WebDataBinderFactory;
import org.springframework.web.context.request.NativeWebRequest;
import org.springframework.web.method.support.HandlerMethodArgumentResolver;
import org.springframework.web.method.support.ModelAndViewContainer;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import org.springframework.web.servlet.view.json.MappingJackson2JsonView;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.module.SimpleModule;

import kr.so.configuration.security.JwtTokenProvider;
import kr.so.configuration.servlet.handler.BaseHandlerInterceptor;
import kr.so.framework.data.web.PageRequestHandleMethodArgumentResolver;
import kr.so.util.BaseCodeLabelEnum;
import kr.so.util.CommonUtil;
import kr.so.util.UserParam;

@Configuration
public class WebConfiguration implements WebMvcConfigurer {

	@Autowired
	// private GlobalConfig config;
	private JwtTokenProvider jwtTokenProvider;

	private static final String WINDOWS_FILE = "file:///";
	private static final String LINUX_FILE = "file:";

	@Value("${file.upload-cours}")
	private String uploadCours;
 

	@Bean
	public ReloadableResourceBundleMessageSource messageSource() {
		ReloadableResourceBundleMessageSource source = new ReloadableResourceBundleMessageSource();
		source.setBasename("classpath:/messages/message");
		source.setDefaultEncoding("UTF-8");
		source.setCacheSeconds(60);
		source.setDefaultLocale(Locale.KOREAN);
		source.setUseCodeAsDefaultMessage(true);
		return source;

	}

	@Bean
	public BaseHandlerInterceptor baseHandlerInterceptor() {
		return new BaseHandlerInterceptor();
	}

	@Bean
	public ObjectMapper objectMapper() {
		ObjectMapper objectMapper = new ObjectMapper();
		SimpleModule simpleModule = new SimpleModule();
		simpleModule.addSerializer(BaseCodeLabelEnum.class, new BaseCodeLabelEnumJsonSerializer());
		objectMapper.registerModule(simpleModule);
		return objectMapper;
	}

	@Bean
	public MappingJackson2JsonView mappingJackson2JsonView() {
		MappingJackson2JsonView jsonView = new MappingJackson2JsonView();
		jsonView.setContentType(MediaType.APPLICATION_JSON_VALUE);
		jsonView.setObjectMapper(objectMapper());
		return jsonView;
	}
/**
 * 
	@Bean
	public GlobalConfig config() {
		return new GlobalConfig();
	}
 */

	@Override
	public void addInterceptors(InterceptorRegistry registry) {
		registry.addInterceptor(baseHandlerInterceptor());
	}

	@Override
	public void addArgumentResolvers(List<HandlerMethodArgumentResolver> resolvers) {
		// 페이지 리졸버 등록
		resolvers.add(new PageRequestHandleMethodArgumentResolver());
		resolvers.add(loginUserResolver());
	}
	public HandlerMethodArgumentResolver loginUserResolver(){
		return new HandlerMethodArgumentResolver(){

			@Override 
			public boolean supportsParameter(MethodParameter parameter){
				return parameter.hasParameterAnnotation(UserParam.class);
			}

			@SuppressAjWarnings({"rawtypes","unchecked"})  
			@Override
			public Object resolveArgument(MethodParameter parameter, ModelAndViewContainer mavContainer,
			NativeWebRequest webRequest, WebDataBinderFactory binderFactory) throws Exception {
				
				Object resolved = null;
				HttpServletRequest request = (HttpServletRequest) webRequest.getNativeRequest();

				String token = jwtTokenProvider.resolveToken(request); // token을 가져옴.
				if (CommonUtil.isEmpty(token)) {
					throw new AuthenticationCredentialsNotFoundException("Unauthorized 토큰이없어 UserParam사용할수없음");
				}
				String userPk = jwtTokenProvider.getUserPk(token);
				
				// 메모리에서 세션 load
				 Map<String, Object> user = CommonUtil.loginSession.get(userPk);
				if(user != null){
					if(Map.class.isAssignableFrom(parameter.getParameterType())){
					// 1. 입력된 파라미터의 default Map 생성
						ObjectMapper mapper = new ObjectMapper();
						Map paramMap = mapper.readValue(getRequestBody(webRequest), Map.class);

					// 2. session 값을 덮어 씀 
					paramMap.put("user",user);
					resolved = paramMap;
					} else if(String.class.isAssignableFrom(parameter.getParameterType())){
						UserParam annotation = parameter.getParameterAnnotation(UserParam.class); 
						resolved = annotation.value().isEmpty()? null : user.get(annotation.value());
					
					} else {
 				throw new AuthenticationCredentialsNotFoundException("Unauthorized in CommonUtil.loginSession 로그인먼저하세요");
					}	
				}
				return resolved;
				
			}

		};
	}

// 웹요청과 관련하여 HttpServletRequest를 jsonBody로 return시킨다.
	private String getRequestBody(NativeWebRequest webRequest) {
		HttpServletRequest servletRequest = webRequest.getNativeRequest(HttpServletRequest.class);

		String jsonBody = (String) webRequest.getAttribute("JSON_REQUEST_BODY", NativeWebRequest.SCOPE_REQUEST);
		if (jsonBody == null) {
			try {
				jsonBody = IOUtils.toString(servletRequest.getInputStream(), "UTF-8");
				webRequest.setAttribute("JSON_REQUEST_BODY", jsonBody, NativeWebRequest.SCOPE_REQUEST);
			} catch (Exception e) {
				throw new RuntimeException(e);
			}
		}
		return jsonBody;

	}
	//  데이터 바인딩, 데이터 포맷 변환, FormatterREgistry는 데이터를 형식화 하고 파싱하기 위한 형식화 서비스를 등록하는 인터페이스
	@Override
	public void addFormatters(FormatterRegistry registry) {
		ObjectMapper objectMapper = new ObjectMapper();
		registry.addConverter(new JsonStringConventor(objectMapper));
	}

	//  CORS는 웹 브라우저의 보안정책으로 인해 웹애플리케이션의 도메인이 다른 서버로부터 리소스에 대한 요청을 제한하는 기술
	@Override
	public void addCorsMappings(CorsRegistry registry) {
		registry.addMapping("/**").allowedOrigins("http://localhost:8080");
	}

	/*
	 * @Override
	public void addResourceHandlers(ResourceHandlerRegistry registry) {
		// 업로드 파일 static resource 접근 경로
		String resourcePattern = config.getUploadResourcePath() + "**";

		// 로컬(윈도우 환경)
		if (config.isLocal()) {
			registry.addResourceHandler(resourcePattern).addResourceLocations("file:///" + config.getUploadFilePath());
		} else {
			// 리눅스 또는 유닉스 환경
			registry.addResourceHandler(resourcePattern).addResourceLocations("file: " + config.getUploadFilePath());
		}

		registry
			.addResourceHandler("/**")
			.addResourceLocations("classpath:/templates/","classpath:/static/","classpath:/views");
	}
	 */

/*	 
	@Bean 
	public AesBytesEncryptor encryptor() { 
		return new AesBytesEncryptor(new String(Hex.encode(config.getEncryptorSecret().getBy)), LINUX_FILE)
	}

	
	@Bean
	public FilterRegistrationBean<SitemeshConfiguration> sitemeshBean(){
		FilterRegistrationBean<SitemeshConfiguration> filter = new FilterRegistrationBean<SitemeshConfiguration>();
		filter.setFilter(new SitemeshConfiguration());
		return filter;
	}	  
**/


}
