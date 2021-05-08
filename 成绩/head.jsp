<%@ page language="java" pageEncoding="UTF-8" contentType="text/html; charset=utf-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<!--http://localhost:8080/sms-->
<%
    String basePath=request.getScheme()+"://"
    +request.getServerName() +":"
    +request.getServerPort()
    +request.getContextPath()+"/";
%>
<!--永远固定的相对路径-->
<base href="<%=basePath%>">
<link type="text/css" rel="stylesheet" href="">
<script type="text/javascript" src="static/jquery.js"></script>
