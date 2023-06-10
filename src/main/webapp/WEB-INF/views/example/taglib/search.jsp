<%@ page language="java" contentType="text/html; charset=EUC-KR"
	pageEncoding="EUC-KR"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib tagdir="/WEB-INF/tags" prefix="tag"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=EUC-KR">
<title>Board</title>
<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-1BmE4kWBq78iYhFldvKuhfTAU6auU8tT94WrHftjDbrCEXSU1oBoqyl2QvZ6jIW3" crossorigin="anonymous">

</head>
<body>
<script src="https://code.jquery.com/jquery-1.11.3.js"></script>
	<div class="container">
		<h2>게시물 목록</h2>
		<form action="" method="get">
			<div class="mb-3 row">
				<label for="exampleFormControlInput1" class="col-sm-2 col-form-label">
				종류
				</label>
				<div class="col-sm-10">
					<tag:bootstrap-checkbox items="${boardTypes}" values="${parameter.boardTypes}"/>
				</div>
			</div>
			<div class="mb-3 text-center">
				<button type="submit" class="btn btn-primary">검색하기</button>
			</div> 
		</form>
		<table class="table">
		
		</table>
	</div>
</body>
</html>