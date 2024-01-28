package kr.so.configuration.security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.builders.WebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
public class SecurityConfiguration extends WebSecurityConfigurerAdapter {

	@Autowired
	private JwtTokenProvider jwtTokenProvider;

	@Bean
	@Override
	public AuthenticationManager authenticationManagerBean() throws Exception {
		return super.authenticationManagerBean();
	}

	@Override
	protected void configure(HttpSecurity http) throws Exception {

		http.httpBasic().disable() // rest api 이므로 기본설정 사용안함. 기본설정은 비인증시 로그인폼 화면으로 리다이렉트 된다.
				.csrf().disable() // rest api이므로 csrf 보안이 필요없으므로 disable처리.
				.sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS) // jwt token 세션필요없으므로 생성안함.

				//.and().authorizeRequests() // 다음 리퀘스트(options, /login/ 등..)에 대한 사용권한 체크
				//.antMatchers(HttpMethod.OPTIONS, "/**").permitAll()
				//.antMatchers("/login/**", "/admin/**", "/test/**", "/cmmn/**", "/vodController/insertVodFileFor*", "/vodController/playVideo*.api", "/weather/**" )
				//.permitAll() // 이하 라우팅은 인증필요없음(X-AUTH-TOKEN);
				//.anyRequest().authenticated() // 위 request외 모두인증필요

				.and().exceptionHandling().accessDeniedHandler(new CustomAccessDeniedHandler()).and()
				.exceptionHandling().authenticationEntryPoint(new CustomAuthenticationEntryPoint())

				.and().addFilterBefore(new JwtAuthenticationFilter(jwtTokenProvider),
						UsernamePasswordAuthenticationFilter.class);
	}

	@Override
	public void configure(WebSecurity web) {
		web.ignoring().regexMatchers("^((?!\\.api).)*$"); // admin페이지, 스웨거페이지등 보이려고설정
	}
}