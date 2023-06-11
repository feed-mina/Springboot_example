<%@ page language="java" contentType="text/html; charset=EUC-KR"
	pageEncoding="EUC-KR"%>

<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt"%>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions"%>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=EUC-KR">
<title>SampleBoard_2306</title>
<link
	href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css"
	rel="stylesheet"
	integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC"
	crossorigin="anonymous">
</head>
<body>


	<div class="container">

		<div class="card">
			<div class="card-header">${board.title}</div>
			<div class="card-body">
				<blockquote class="blockquote mb-0">
					<p>${board.contents}</p>
					<footer class="blockquote-footer"> <fmt:formatDate
						value="${board.regDate}" pattern="yyyy.MM.dd HH:mm" /> </footer>
				</blockquote>
			</div>
		</div>

		<div class="d-grid gap-2 d-md-flex justify-content-md-end mt-2">
			<a href="/board/list" class="btn btn-primary me-md-2" type="button"><spring:message
					code="button.list" /></a> <a href="/board/edit/${board.boardSeq}"
				class="btn btn-primary" type="button"><spring:message
					code="button.edit" /></a>
		</div>

		<form id="form" method="get" action="/list">
			<input type="hidden" name="boardType" value="COMMUNITY" />
			<div class="row mb-3">
				<label for="title" class="col-sm-2 col-form-label"><spring:message
						code="search.keyword" /></label>
				<div class="col-sm-10">
					<input type="text" class="form-control" name="keyword"
						value="${parameter.keyword}" id="keyword"
						placeholder="<spring:message code="placeholder.required" />">
				</div>
			</div>
			<!-- 
			<div class="row mb-3">
				<label for="contents" class="col-sm-2 col-form-label"><spring:message
						code="board.contents" /></label>
				<div class="col-sm-10">
					<textarea class="form-control"  name="contents" id="contents"
						placeholder="<spring:message code="placeholder.required" />">${board.contents}</textarea>
				</div>
			</div>
			 -->
			<button type="submit" class="btn btn-primary">
				<spring:message code="button.search" />
			</button>
		</form>
	</div>

	<script src="https://code.jquery.com/jquery-1.11.3.js"></script>
	<script>
		$(function() {
			var $form = $('#form');
			$form.bind('submit', function() {
				$.ajax({
					url : '/board/save',
					type : 'post',
					data : $form.serialize(), 
					dataType : 'json',
					success : function(data) {
						if(data.code == 'SUCCESS'){
							alert('저장되었습니다.');
						}else{
							alert(data.message);
						} 
						console.log(data);
						console.log(data.code);
						console.log(data.message); 
					}
				});
				return false;
			});
		});
	</script>
	<table class="table caption-top">
		<thead>
			<tr>
				<th scope="col">#</th>
				<th scope="col"><spring:message code="board.title" /></th>
				<th scope="col"><spring:message code="board.viewCount" /></th>
				<th scope="col"><spring:message code="board.regDate" /></th>
			</tr>
		</thead>
		<tbody>
			<c:forEach var="board" items="${boardList}" varStatus="status">
				<tr>
					<th scope="row">${status.count}</th>
					<td><a href="/board/${boardSeq}">${board.title}</a></td>
					<td>${board.viewCount}</td>
					<td><fmt:formatDate value="${board.regDate}"
							pattern="yyyy.MM.dd HH:mm" /></td>
					<td>@예린</td>
				</tr>
			</c:forEach>

			<c:if test="{fn:length(boardList) == 0}">
				<tr>
					<td colspan="4"><spring:message code="msg.board.empty" /></td>
				</tr>
			</c:if>

		</tbody>
	</table>
 
</body>
</html>