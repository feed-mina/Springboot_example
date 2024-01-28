package kr.so.service;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import kr.so.dao.CommonDao;

@Service
public class SysManageService {
	
    @Autowired
    private CommonDao commonDao;

    @Autowired
    private FileService fileService;

    @Autowired
    private CommonService commonService;

	public void insertSttemntBlclst(MultipartFile[] uploadFile, Map<String, Object> paramMap) throws Exception{
		
		fileService.fileRegist(uploadFile, paramMap, "");
		commonDao.insert("sysManage.insertSttemntBlclst", paramMap);
	}

	public Map<String, Object> selectMberBlclstPaging(Map<String, Object> paramMap) throws Exception{
		
		Map<String, Object> pagingList = commonService.selectPaging("sysManage.selectMberBlclstPaging", paramMap);
		List<Map<String, Object>> list = (List<Map<String, Object>>) pagingList.get("list");
		for(Map<String, Object> obj: list){
			obj.put("fileSeq", obj.get("fileSeq"));
			obj.put("file", fileService.fileMap(obj));
		}
		return pagingList;
	}
}
