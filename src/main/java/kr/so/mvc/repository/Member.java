package kr.so.mvc.repository;

import java.util.Date;

import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.Id;

import org.springframework.boot.autoconfigure.domain.EntityScan;

import kr.so.mvc.domain.MemberType;
import lombok.Data;

@Data
// Entity에서 class명이랑 같으면 굳이 어노테이션을 할 필요가 없으나 다르면 @Entity 를 사용해앟ㅁ
@Entity(name="T_MEMBER")
public class Member {

	@Id
	private String memberId;
	
	@Enumerated(EnumType.STRING)
	private MemberType memberType;
	private String password;
	private String name;
	private String companyName;
	private String departName;
	private String email;
	private String telNumber;
	private String phoneNumber;
	private String zipcode;
	private String address;
	private String addressDetail;
	private boolean agreeTerms;
	private boolean agreeEmail;
	private boolean agreeSns;
	private String memberState;
	private Date loginDate;
	private Date deDate;
	private Date joinDate;
	private Date updateDate;
	

}
