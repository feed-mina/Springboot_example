package kr.so.java.mvc.repository;

import org.springframework.stereotype.Repository;

import kr.so.java.framework.data.domain.UploadFile;
import kr.so.java.mvc.parameter.UploadFileParameter;

@Repository
public interface UploadFileRepository {

	void save(UploadFileParameter parameter);

	UploadFile get(int uploadFileSeq);
}
