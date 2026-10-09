package com.polimigo.pos.pos.reports.controllers;

import com.polimigo.pos.pos.reports.DAO.CustomerStatementDto;
import com.polimigo.pos.pos.reports.services.statement.CustomerStatementService;
import freemarker.template.Configuration;
import freemarker.template.Template;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.StringWriter;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("api/reports/customer-statement")
public class CustomerStatementController {

    @Autowired private CustomerStatementService statementService;
    @Autowired private Configuration freemarkerConfig;

    @GetMapping("/preview")
    public ResponseEntity<String> previewStatement(
            @RequestParam Long customerId,
            @RequestParam(required = false) @DateTimeFormat(pattern = "yyyy-MM-dd") Date from,
            @RequestParam(required = false) @DateTimeFormat(pattern = "yyyy-MM-dd") Date to) throws Exception {
        
        CustomerStatementDto data = statementService.getStatement(customerId, from, to);
        
        Template template = freemarkerConfig.getTemplate("statements/customer-statement.ftlh");
        Map<String, Object> model = new HashMap<>();
        model.put("report", data);
        model.put("printDate", new java.text.SimpleDateFormat("yyyy-MM-dd HH:mm").format(new Date()));
        
        StringWriter out = new StringWriter();
        template.process(model, out);
        
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.TEXT_HTML);
        return ResponseEntity.ok().headers(headers).body(out.toString());
    }
}