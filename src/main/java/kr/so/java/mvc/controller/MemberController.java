package kr.so.java.mvc.controller;

import java.util.Calendar;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import kr.so.java.mvc.domain.MemberType;
import kr.so.java.mvc.repository.Member;
import kr.so.java.mvc.repository.MemberMappingName;
import kr.so.java.mvc.service.MemberService;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/user/*")
@RequiredArgsConstructor
public class MemberController {
	@Autowired
	private final MemberService memberService;
	
	@GetMapping("/save")
	public Member save() {
		Member member = new Member(); // 만약 test12345가 없으면 아래 정보를 데이터에 저장한다.
		member.setMemberId("테스트성공?");
		member.setMemberType(MemberType.S);
		member.setEmail("test@naver.com");
		member.setZipcode("서울시");
		member.setAddress("01322");
		member.setJoinDate(Calendar.getInstance().getTime());
		member.setName("민예린");
		member.setMemberState("N");
		member.setPassword("test");
		member.setPhoneNumber("0101234123");
		member.setUpdateDate(Calendar.getInstance().getTime());
		memberService.save(member);
		return member;
	}
	
	 
	@GetMapping("/findById/{memberId}")
	public Member findById(@PathVariable String memberId) {
		return memberService.findById(memberId);
	}

@GetMapping("/findByName/{name}")
public List<Member> findByName(@PathVariable String name){
	return memberService.findByName(name);
}

// 이름이 존재하는지
@GetMapping("/existsByName/{name}")
public boolean existsByName(@PathVariable String name) {
	return memberService.existsByName(name);
}

// 이름이 몇개인지
@GetMapping("/countByName/{name}")
public int countByNAme(@PathVariable String name) {
	return memberService.countByName(name);
}

}
