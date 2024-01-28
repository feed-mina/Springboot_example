package kr.so.service;

import java.util.ArrayList;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import kr.so.dao.CommonDao;

@Service
public class CommunityService {
    @Autowired
    private CommonDao commonDao;

    public int hideCommunityList(Map<String, Object> paramMap) throws Exception {
        ArrayList<String> communitySeqList = (ArrayList<String>) paramMap.get("communitySeq");
        int result = 0;
        for (String communitySeq : communitySeqList) {
            paramMap.put("communitySeq", communitySeq);
            result += commonDao.update("sysCommunity.hideCommunityList", paramMap);
        }
        return result;
    }

    public int showCommunityList(Map<String, Object> paramMap) throws Exception {
        ArrayList<String> communitySeqList = (ArrayList<String>) paramMap.get("communitySeq");
        int result = 0;
        for (String communitySeq : communitySeqList) {
            paramMap.put("communitySeq", communitySeq);
            result += commonDao.update("sysCommunity.showCommunityList", paramMap);
        }
        return result;
    }
}
