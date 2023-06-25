package kr.so.java.mvc.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import kr.so.java.mvc.parameter.BoardParameter;
import kr.so.java.mvc.repository.MemberMappingName;


@Repository
public interface MemberRepository {
// String findById(String memberId);
	// 	Member get(String memberId);
	Member findById(String memberId); 
void save(Member member);
List<Member> findByName(String name);
boolean existsByName(String name);
int countByName(String name);
List<MemberMappingName> findNameMappingByName(String name);
}
