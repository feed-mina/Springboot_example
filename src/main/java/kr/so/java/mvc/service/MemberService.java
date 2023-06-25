package kr.so.java.mvc.service;

import java.util.List;

import org.springframework.stereotype.Service;

import kr.so.java.mvc.repository.Member;
import kr.so.java.mvc.repository.MemberMappingName;
import kr.so.java.mvc.repository.MemberRepository;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class MemberService {

// @RequiredArgsConstructor 을 사용하려면 final 생성자를 사용해야 한다.
	private final MemberRepository memberRepository;

	public void save(Member member) {
		memberRepository.save(member);
	}
	
	public Member findById(String memberId) {
		return memberRepository.findById(memberId);
		// orElseThrow 는 데이터가 없을때 RuntimeException 한다
	}
	
	public List<Member> findByName(String name){
		return memberRepository.findByName(name);
	}
	
	public List<MemberMappingName> findNameMappingByName(String name){
		return memberRepository.findNameMappingByName(name);
	}

	public boolean existsByName(String name) {
		return memberRepository.existsByName(name);
	}

	public int countByName(String name) {
		return memberRepository.countByName(name);
	} 
}
