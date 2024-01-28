package kr.so.service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class DashboardService {

	@Autowired
	CommonService commonService;

	public Map<String, Object> selectUserLoginCountList(Map<String, Object> paramMap) throws Exception {
		List<Map<String, Object>> resultList = new ArrayList<>();
		Map<String, Object> resultMap = new HashMap<>();

		Map<String, Object> daily = (Map<String, Object>) paramMap.get("daily");
		resultList = commonService.selectList("selectUserLoginCountList", daily);
		resultMap.put("daily", resultList);

		Map<String, Object> monthly = (Map<String, Object>) paramMap.get("monthly");
		resultList = commonService.selectList("selectUserLoginCountList", monthly);
		resultMap.put("monthly", resultList);

		Map<String, Object> times = (Map<String, Object>) paramMap.get("times");
		resultList = commonService.selectList("selectUserLoginCountList", times);
		resultMap.put("times", resultList);

		return resultMap;
	}
}
