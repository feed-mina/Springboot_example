<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=EUC-KR">
<title>file/save</title>
</head>
<body>
<form action="/file/save" method="post" enctype="multipart/form-data">
	<input type="file" name="uploadFile" />
	<button type="submit">파일업로드</button>
</form>
</body>
</html>