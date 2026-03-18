package com.ruoyi.web.controller.pms;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import com.ruoyi.common.annotation.Log;
import com.ruoyi.common.core.controller.BaseController;
import com.ruoyi.common.core.domain.AjaxResult;
import com.ruoyi.common.core.page.TableDataInfo;
import com.ruoyi.common.enums.BusinessType;
import com.ruoyi.system.pms.domain.PmsImportDetail;
import com.ruoyi.system.pms.domain.PmsImportRecord;
import com.ruoyi.system.pms.service.IPmsImportDetailService;
import com.ruoyi.system.pms.service.IPmsImportRecordService;

/**
 * 数据导入Controller
 *
 * @author ruoyi
 */
@RestController
@RequestMapping("/pms/import")
public class PmsImportController extends BaseController
{
    @Autowired
    private IPmsImportRecordService importRecordService;

    @Autowired
    private IPmsImportDetailService importDetailService;

    /**
     * 上传导入文件
     */
    @PreAuthorize("@ss.hasPermi('pms:import:upload')")
    @Log(title = "数据导入", businessType = BusinessType.IMPORT)
    @PostMapping("/upload")
    public AjaxResult upload(@RequestParam("file") MultipartFile file,
            @RequestParam("importType") String importType)
    {
        // TODO: 实现文件上传和解析逻辑
        PmsImportRecord record = new PmsImportRecord();
        record.setImportType(importType);
        record.setFileName(file.getOriginalFilename());
        record.setFileType(file.getContentType());
        record.setStatus("0");
        record.setCreateBy(getUsername());
        importRecordService.insertRecord(record);
        return success(record);
    }

    /**
     * 查询导入记录列表
     */
    @PreAuthorize("@ss.hasPermi('pms:import:list')")
    @GetMapping("/records")
    public TableDataInfo records(PmsImportRecord pmsImportRecord)
    {
        startPage();
        List<PmsImportRecord> list = importRecordService.selectRecordList(pmsImportRecord);
        return getDataTable(list);
    }

    /**
     * 获取导入明细列表
     */
    @PreAuthorize("@ss.hasPermi('pms:import:query')")
    @GetMapping("/details/{recordId}")
    public AjaxResult getDetails(@PathVariable("recordId") Long recordId)
    {
        List<PmsImportDetail> details = importDetailService.getByRecordId(recordId);
        return success(details);
    }

    /**
     * 验证单条明细
     */
    @PreAuthorize("@ss.hasPermi('pms:import:edit')")
    @Log(title = "数据导入", businessType = BusinessType.UPDATE)
    @PutMapping("/verify/{detailId}")
    public AjaxResult verifyDetail(@PathVariable("detailId") Long detailId,
            @RequestParam("verifyStatus") String verifyStatus,
            @RequestParam(value = "verifyRemark", required = false) String verifyRemark)
    {
        return toAjax(importDetailService.updateVerifyStatus(detailId, verifyStatus, verifyRemark));
    }

    /**
     * 批量验证
     */
    @PreAuthorize("@ss.hasPermi('pms:import:edit')")
    @Log(title = "数据导入", businessType = BusinessType.UPDATE)
    @PutMapping("/batchVerify/{recordId}")
    public AjaxResult batchVerify(@PathVariable("recordId") Long recordId,
            @RequestParam("verifyStatus") String verifyStatus)
    {
        importDetailService.batchUpdateVerifyStatus(recordId, verifyStatus);
        return success();
    }
}