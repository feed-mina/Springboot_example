package kr.so.mvc.repository;

import org.springframework.stereotype.Repository;

import kr.so.framework.data.domain.UploadFile;
import kr.so.mvc.parameter.UploadFileParameter;

@Repository
public interface UploadFileRepository {

	void save(UploadFileParameter parameter);

	UploadFile get(int uploadFileSeq);
}
