package kr.so.service;

import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import kr.so.dao.CommonDao;

@Service("testService")
public class TestService {

	private Logger log = LoggerFactory.getLogger(this.getClass());

	@Autowired
	private CommonDao commonDao;

	public boolean testTransaction(Map<String, Object> paramMap) {
		commonDao.selectMap("test.seq", paramMap);

		paramMap.put("loginId", "tran");
		paramMap.put("loginNm", "tran");
		paramMap.put("loginPw", "tran01");

		commonDao.insert("test.testTransaction", paramMap);

		paramMap.put("loginNm", "tran01");
		commonDao.insert("test.testTransaction", paramMap);

		return true;
	}

}
