package kr.so;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@SpringBootApplication
/**  @SpringBootApplication 은 Spring Boot 애플리케이션의 주요 설정을 담당하는 어노테이션이다. 
이 어노테이션을 사용하면 애플리케이션을 실행하는데 필요한 여러 설정들을 자동으로 구성하고 있다. 
1) @Configuration : 클래스가 스프링의 Java 기반 설정 클래스임을 나타낸다.
2) @EnableAutoConfifuration : 클래스 패스에 존재하는 라이브러리나 프레임워크를 기반으로 하여 자동으로 설정을 추가
3) @ComponentScan : 스프리이 빈을 찾아 등록할 패키지를 지정한다.
4) @EnableCaching 어노테이션 : 스프링에서 제고하는 캐싱 기능을 활성화, 이 어노테이션을 사용하면 메서드의 결과를 캐싱하여 동일한 요청에 대한 반복적인 계산을 방지할 수 있다.
4-1) 캐싱은 @Cacheable, @CacheEvict, @CachePut 등의 어노테이션을 사용하여 메서드에 적용한다.
5) @EnalgeSheduling : 스프링에서 제공하는 스케줄링 기능을 활성화, 이 어토네이션은 @Scheduled 어노테이션을 이용하여 주기적으로 실행되는 메서드를 정의한다. 
스케줄링은 일정한 주기나 특정 시간에 작업을 실행하고자 할때 유용한다.
6) @ Controller : 어노테이션이 해당 클라스가 스프링 MVC의 컨트롤러임을 나타낸다. 스프링 MVC는 클라이언트의 HTTP 요청을 처리하고 응답을 반환하는데 사용, 
6-1) @Controller 어노테이션이 지정된 클래스는 스프링 컨테이너에서 빈으로 등록된다. 그리고 HTTP 요청에 대한 처리를 담당하는 메서드들을 포함한다.

*/ 
@EnableCaching
@Controller
public class ExampleSpringApplication {

	public static void main(String[] args) {
		SpringApplication.run(ExampleSpringApplication.class, args);
	}

	@RequestMapping("/")
	public String index(){
		return "Hello Word\n";
	}

	@GetMapping("/dashboard")
		public String goDashBoard(){
			return "redirect:/kr/so/dashboard/main.html";
		}

}

/*
 * public class ExampleSpringApplication {

	public static void main(String[] args) {
		SpringApplication.run(ExampleSpringApplication.class, args);
	}

// 2024.01.15 .admin 추가
@GetMapping("/admin")
	public String redirectAdmin() {
		return "redirect:/kr/so/admin/main.html";
	}

}

 */