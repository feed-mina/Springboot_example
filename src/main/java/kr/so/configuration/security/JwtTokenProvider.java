package kr.so.configuration.security;


import java.util.Base64;
import java.util.Date;

import javax.annotation.PostConstruct;
import javax.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.stereotype.Component;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.Jws;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;

@Component
public class JwtTokenProvider {
	// JWT 토큰을 생성 및 검증 모듈

	@Value("${spring.jwt.secret}")
	private String secretKey;

	private final long tokenValidMilisecond = 1000L * 60 * 60 * 10; 
	// 10시간만 토큰 유효

	private final UserDetailsService userDetailsService;

	public JwtTokenProvider(@Qualifier("userUserDetailsService") UserDetailsService userDetailsService) {
		this.userDetailsService = userDetailsService;
	}


	// @PostConstruct 어노테이션이 붙은 메서드가 객체의 생성 이후 초기화 작업을 수행하도록 지정한다. 
	@PostConstruct
	protected void init() {
		secretKey = Base64.getEncoder().encodeToString(secretKey.getBytes());
	}

	// Jwt 토큰 생성
	public String createToken(String userPk, String roles) {
		Claims claims = Jwts.claims().setSubject(userPk);
		claims.put("roles", roles);
		Date now = new Date();
		return Jwts.builder().setClaims(claims) // 데이터
				.setIssuedAt(now) // 토큰 발행일자
				.setExpiration(new Date(now.getTime() + tokenValidMilisecond)) // set Expire Time
				.signWith(SignatureAlgorithm.HS256, secretKey) // 암호화 알고리즘, secret값 세팅
				.compact(); // Token 생성
	}

	// Jwt 토큰으로 인증 정보를 조회
	public Authentication getAuthentication(String token) {
		try{
			UserDetails userDetails = userDetailsService.loadUserByUsername(this.getUserPk(token));
			return new UsernamePasswordAuthenticationToken(userDetails, "", userDetails.getAuthorities());
		}catch(Exception e){
			return null;
		}
	}

	// Jwt 토큰에서 회원 구별 정보 추출 (토큰분해후 sub에 있는 값을 pk로 사용(userSeq사용중))
	public String getUserPk(String token) {
		return Jwts.parser().setSigningKey(secretKey).parseClaimsJws(token).getBody().getSubject();
	}

	// Request의 Header에서 token 파싱 : "X-AUTH-TOKEN: jwt토큰"
	public String resolveToken(HttpServletRequest req) {
		return req.getHeader("X-AUTH-TOKEN");
	}

	// Jwt 토큰의 유효성 + 만료일자 확인
	public boolean validateToken(String jwtToken) {
		try {
			Jws<Claims> claims = Jwts.parser().setSigningKey(secretKey).parseClaimsJws(jwtToken);
			return !claims.getBody().getExpiration().before(new Date());
		} catch (Exception e) {
			return false;
		}
	}

	/** 토큰이 만료되어도 ExpiredJwtException 익셉션에서 값을 뽑아내서 새토큰발행*/
	public String refreshToken(String jwtToken){
		Claims claims;
		try {
			claims = Jwts.parser().setSigningKey(secretKey).parseClaimsJws(jwtToken).getBody();
        } catch (ExpiredJwtException e) {
			claims = e.getClaims();
        }
		String sub = claims.getSubject();
		String roles = (String) claims.get("roles");
		return this.createToken(sub, roles);
	}
}
