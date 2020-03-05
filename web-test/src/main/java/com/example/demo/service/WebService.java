package com.example.demo.service;

import cn.hutool.core.date.DateUtil;
import cn.hutool.core.io.FileUtil;
import cn.hutool.core.util.IdUtil;
import cn.hutool.json.JSONUtil;
import cn.tenfell.tools.nocontroller.inface.NoControllerInterface;
import cn.tenfell.tools.nocontroller.utilsentity.PoData;
import cn.tenfell.tools.nocontroller.utilsentity.R;
import org.springframework.stereotype.Service;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.Part;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

@Service
public class WebService implements NoControllerInterface {
    static String uploadPath = "/Users/fs/Downloads/uploadFiles";
    public void upload(HttpServletRequest request, HttpServletResponse response) throws Exception{
        Collection<Part> files =  request.getParts();
        List<String> fileIds = new ArrayList<>();
        for(Part part:files){
            String fileName = part.getSubmittedFileName();
            int c = fileName.lastIndexOf(".");
            if(c != -1){
                fileName = fileName.substring(c);
            }
            InputStream is = part.getInputStream();
            String fileId = DateUtil.today() +"/"+ IdUtil.getSnowflake(0,1).nextIdStr() +fileName;
            String filePath = uploadPath+"/"+fileId;
            FileUtil.writeFromStream(is,filePath);
            fileIds.add(fileId);
        }
        String aa = JSONUtil.toJsonStr(R.okData(PoData.create().set("fileId",fileIds.get(0)).set("fileIds",fileIds)));
        response.setHeader("Content-Type","application/json");
        response.getOutputStream().write(aa.getBytes());
    }
    public void down(HttpServletRequest request, HttpServletResponse response) throws Exception{
        String fileId = request.getParameter("fileId");
        String filePath = uploadPath+"/"+fileId;
        response.getOutputStream().write(FileUtil.readBytes(filePath));
    }
    public R ajax(PoData poData){
        return R.okData(poData);
    }
    @Override
    public Object getLoginUser(HttpServletRequest request) {
        return null;
    }
}
