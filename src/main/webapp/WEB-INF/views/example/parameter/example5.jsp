<%@ page language="java" contentType="text/html; charset=EUC-KR"
    pageEncoding="EUC-KR"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=EUC-KR">
<title>ExampleParamter</title>
</head>
<body>
<h2 style="text-align : cnter; margin-top:100px;">ids: ${ids}</h2>
<c:forEach var="id" items="${ids}">
<p>${id}</p>
</c:forEach>
</body>
</html>