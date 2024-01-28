package kr.so.mvc.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import kr.so.framework.data.domain.UploadFile;
import kr.so.mvc.parameter.UploadFileParameter;
import kr.so.mvc.repository.UploadFileRepository;

@Service
public class UploadFileService {

	
	@Autowired
	private UploadFileRepository repository;
	
	public void save(UploadFileParameter parameter) {
		repository.save(parameter);
	}

	public UploadFile get(int uploadFileSeq) {
		return repository.get(uploadFileSeq);
		
	}

}
