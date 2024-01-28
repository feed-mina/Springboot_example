package kr.so.mvc.controller;

import java.io.File;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;

import kr.so.configuration.exception.BaseException;
import kr.so.configuration.http.BaseResponseCode;
import kr.so.framework.data.domain.ThumbnailType;
import kr.so.framework.data.domain.UploadFile;
import kr.so.mvc.service.UploadFileService;
import net.coobird.thumbnailator.Thumbnails;

@Controller
@RequestMapping("/thumbnail")
public class ThumbnailController {
	
	final Logger logger = LoggerFactory.getLogger(getClass());
	
	@Autowired
	private UploadFileService uploadFileService;
	
	@GetMapping("/make/{uploadFileSeq}/{thumbnailType}")
	public void make(@PathVariable int uploadFileSeq, @PathVariable ThumbnailType thumbnailType) {
		UploadFile uploadFile = uploadFileService.get(uploadFileSeq);
		if (uploadFile == null) {
			throw new BaseException(BaseResponseCode.UPLOAD_FILE_IS_NULL);
		}
		String pathname = uploadFile.getPathname();
		File file = new File(pathname);
		
		if(file.isFile()) {

			throw new BaseException(BaseResponseCode.UPLOAD_FILE_IS_NULL);	
		}
		
		try {
			String thumbnailFilename = uploadFile.getFilename().replace(".", thumbnailType.width() + "_"+ thumbnailType.height() +".");
			Thumbnails.of(pathname).size(thumbnailType.width(), thumbnailType.height()).toFile("thumbnail.jpg");
			logger.info("thumbnailFilename : {}", thumbnailFilename);
		} catch (Exception e) {
			e.printStackTrace();
		}
	}

}
