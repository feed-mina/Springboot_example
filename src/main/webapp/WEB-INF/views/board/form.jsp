<%@ page language="java" contentType="text/html; charset=EUC-KR"
	pageEncoding="EUC-KR"%>

<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=EUC-KR">
<title>SampleBoard_2306</title>

	<script src="https://code.jquery.com/jquery-1.11.3.js"></script>
</head>
<body>

	<div class="container">
		<form id="form" method="post" action="/save">
			<input type="hidden" name="boardType" value="COMMUNITY" />
			<div class="row mb-3">
				<label for="title" class="col-sm-2 col-form-label"><spring:message
						code="board.title" /></label>
				<div class="col-sm-10">
					<input type="text" class="form-control" name="title"
						value="${board.title}" id="title"
						placeholder="<spring:message code="placeholder.required" />">
				</div>
			</div>
			<div class="row mb-3">
				<label for="contents" class="col-sm-2 col-form-label"><spring:message
						code="board.contents" /></label>
				<div class="col-sm-10">
					<textarea class="form-control"  name="contents" id="contents"
						placeholder="<spring:message code="placeholder.required" />">${board.contents}</textarea>
				</div>
			</div>

			<button type="submit" class="btn btn-primary">
				<spring:message code="button.save" />
			</button>
		</form>

	</div>
	<script>
		$(function() {
			var $form = $('#form');
			$form.bind('submit', function() {
				$.ajax({
					url : '/notice/save',
					//url : '/board/save',
					type : 'post',
					data : $form.serialize(), 
					dataType : 'json',
					success : function(response) {
						if(response.code == 'SUCCESS'){
							alert('저장되었습니다.');
							location.href='/notice/' + response.data ;
						}else{
							alert(data.message);
						} 
					}
				});
				return false;
			});
		});
	</script>
</body>
</html>