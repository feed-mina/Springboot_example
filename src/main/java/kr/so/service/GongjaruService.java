package kr.so.service;

import kr.so.mvc.service.CommonService;
import kr.so.util.CamelHashMap;
import kr.so.util.CommonUtil;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class GongjaruService {
    @Autowired
    FileService fileService;

    @Autowired
    CommonService commonService;

    public void upsert(Map<String, Object> paramMap, MultipartFile[] fileList) throws Exception {
        List spotList = (List) paramMap.get("spotList");
        Map<String, Object> parameter = new CamelHashMap();

        for (int i = 0; i < spotList.size(); i++) {
            parameter.put("spotKey", spotList.get(i));
            Map<String, Object> gongjaruMap = commonService.selectMap("Gongjaru.selectGongjaruOne", parameter);
            if (CommonUtil.isEmpty(gongjaruMap.get("spotKey"))) {
                // 없으면 insert
                try {
                    fileService.fileRegist(fileList[i], gongjaruMap, "file");
                } catch (Exception e) {
                    throw new RuntimeException(e);
                }
                gongjaruMap.put("spotKey", spotList.get(i));
                commonService.insert("Gongjaru.insertGongjaru", gongjaruMap);
            } else {
                // 있으면 update
                if (!CommonUtil.isEmpty(gongjaruMap.get("fileSeq")) && !CommonUtil.isEmpty(fileList[i])) {
                    try {
                        fileService.fileDelete(gongjaruMap);
                    } catch (Exception e) {
                        throw new RuntimeException(e);
                    }
                }

                try {
                    fileService.fileRegist(fileList[i], gongjaruMap, "file");
                } catch (Exception e) {
                    throw new RuntimeException(e);
                }
                commonService.update("Gongjaru.updateGongjaru", gongjaruMap);

                if (!CommonUtil.isEmpty(paramMap.get("delFileSeq"))) {
                    commonService.delete("file.deleteFileMastr", gongjaruMap);
                }
            }
        }
        List<Map<String, Object>> contentsList = (List<Map<String, Object>>) paramMap.get("commentList");
        usertContents(contentsList);
    }

    public void usertContents(Map<String, Object> paramMap) {
        Map<String, Object> gongjaruMap = commonService.selectMap("Gongjaru.selectGongjaruOne", paramMap);
        if (CommonUtil.isEmpty(gongjaruMap.get("spotKey"))) {
            // 없으니 insert
            commonService.insert("Gongjaru.insertGongjaru", paramMap);
        } else {
            // 있으면 update
            commonService.update("Gongjaru.updateGongjaru", paramMap);
        }
    }

    public void usertContents(List<Map<String, Object>> paramMap) {
        paramMap.forEach(x -> {
            Map<String, Object> gongjaruMap = commonService.selectMap("Gongjaru.selectGongjaruOne", x);
            if (CommonUtil.isEmpty(gongjaruMap.get("spotKey"))) {
                // 없으니 insert
                commonService.insert("Gongjaru.insertGongjaru", x);
            } else {
                // 있으면 update
                commonService.update("Gongjaru.updateGongjaru", x);
            }
        });
    }
}
