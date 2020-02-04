package com.example.demo.service;

import cn.hutool.core.io.FileUtil;
import cn.hutool.core.lang.UUID;
import cn.hutool.json.JSONUtil;
import cn.tenfell.tools.nocontroller.inface.NoControllerInterface;
import cn.tenfell.tools.nocontroller.utilsentity.PoData;
import cn.tenfell.tools.nocontroller.utilsentity.R;
import org.springframework.stereotype.Service;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.Part;
import javax.swing.text.html.parser.Entity;
import java.io.InputStream;

@Service
public class WebService implements NoControllerInterface {
    public void uploadFile(HttpServletRequest request, HttpServletResponse response) throws Exception{
        Part part = request.getPart("file");
        String fileName = part.getSubmittedFileName();
        InputStream is = part.getInputStream();
        String fileId = UUID.fastUUID().toString()+fileName;
        FileUtil.writeFromStream(is,"/Users/fs/Downloads/"+UUID.fastUUID().toString()+fileName);
        String aa = JSONUtil.toJsonStr(R.okData(PoData.create().set("fileId",fileId)));
        response.setHeader("Content-Type","application/json");
        response.getOutputStream().write(aa.getBytes());
    }

    public void test(HttpServletRequest request, HttpServletResponse response) throws Exception{
        String aa = JSONUtil.toJsonStr(R.okData(PoData.create().set("msg","ok")));
        response.setHeader("Content-Type","application/json");
        response.getOutputStream().write(aa.getBytes());
    }

    public R test2(PoData param, Entity entity){
        return R.okData(PoData.create().set("msg","ok"));
    }

    @Override
    public Object getLoginUser(HttpServletRequest request) {
        return null;
    }
}
