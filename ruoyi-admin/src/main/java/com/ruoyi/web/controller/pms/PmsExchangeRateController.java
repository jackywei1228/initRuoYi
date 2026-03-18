package com.ruoyi.web.controller.pms;

import java.util.Date;
import java.util.List;
import javax.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import com.ruoyi.common.annotation.Log;
import com.ruoyi.common.core.controller.BaseController;
import com.ruoyi.common.core.domain.AjaxResult;
import com.ruoyi.common.core.page.TableDataInfo;
import com.ruoyi.common.enums.BusinessType;
import com.ruoyi.common.utils.poi.ExcelUtil;
import com.ruoyi.system.pms.domain.PmsExchangeRate;
import com.ruoyi.system.pms.service.IPmsExchangeRateService;

/**
 * 汇率Controller
 *
 * @author ruoyi
 */
@RestController
@RequestMapping("/pms/exchangeRate")
public class PmsExchangeRateController extends BaseController
{
    @Autowired
    private IPmsExchangeRateService pmsExchangeRateService;

    /**
     * 查询汇率列表
     */
    @PreAuthorize("@ss.hasPermi('pms:exchangeRate:list')")
    @GetMapping("/list")
    public TableDataInfo list(PmsExchangeRate pmsExchangeRate)
    {
        startPage();
        List<PmsExchangeRate> list = pmsExchangeRateService.selectExchangeRateList(pmsExchangeRate);
        return getDataTable(list);
    }

    /**
     * 导出汇率列表
     */
    @PreAuthorize("@ss.hasPermi('pms:exchangeRate:export')")
    @Log(title = "汇率管理", businessType = BusinessType.EXPORT)
    @PostMapping("/export")
    public void export(HttpServletResponse response, PmsExchangeRate pmsExchangeRate)
    {
        List<PmsExchangeRate> list = pmsExchangeRateService.selectExchangeRateList(pmsExchangeRate);
        ExcelUtil<PmsExchangeRate> util = new ExcelUtil<PmsExchangeRate>(PmsExchangeRate.class);
        util.exportExcel(response, list, "汇率数据");
    }

    /**
     * 获取汇率详细信息
     */
    @PreAuthorize("@ss.hasPermi('pms:exchangeRate:query')")
    @GetMapping(value = "/{rateId}")
    public AjaxResult getInfo(@PathVariable("rateId") Long rateId)
    {
        return success(pmsExchangeRateService.selectExchangeRateById(rateId));
    }

    /**
     * 获取最新汇率
     */
    @PreAuthorize("@ss.hasPermi('pms:exchangeRate:query')")
    @GetMapping("/latest")
    public AjaxResult getLatestRate(@RequestParam("currencyPair") String currencyPair)
    {
        return success(pmsExchangeRateService.getLatestRate(currencyPair));
    }

    /**
     * 获取历史汇率列表
     */
    @PreAuthorize("@ss.hasPermi('pms:exchangeRate:query')")
    @GetMapping("/history")
    public AjaxResult getHistoryRates(@RequestParam("currencyPair") String currencyPair,
            @RequestParam("startDate") @DateTimeFormat(pattern = "yyyy-MM-dd") Date startDate,
            @RequestParam("endDate") @DateTimeFormat(pattern = "yyyy-MM-dd") Date endDate)
    {
        return success(pmsExchangeRateService.getHistoryRates(currencyPair, startDate, endDate));
    }

    /**
     * 新增汇率
     */
    @PreAuthorize("@ss.hasPermi('pms:exchangeRate:add')")
    @Log(title = "汇率管理", businessType = BusinessType.INSERT)
    @PostMapping
    public AjaxResult add(@Validated @RequestBody PmsExchangeRate pmsExchangeRate)
    {
        pmsExchangeRate.setCreateBy(getUsername());
        return toAjax(pmsExchangeRateService.insertExchangeRate(pmsExchangeRate));
    }

    /**
     * 修改汇率
     */
    @PreAuthorize("@ss.hasPermi('pms:exchangeRate:edit')")
    @Log(title = "汇率管理", businessType = BusinessType.UPDATE)
    @PutMapping
    public AjaxResult edit(@Validated @RequestBody PmsExchangeRate pmsExchangeRate)
    {
        pmsExchangeRate.setUpdateBy(getUsername());
        return toAjax(pmsExchangeRateService.updateExchangeRate(pmsExchangeRate));
    }

    /**
     * 删除汇率
     */
    @PreAuthorize("@ss.hasPermi('pms:exchangeRate:remove')")
    @Log(title = "汇率管理", businessType = BusinessType.DELETE)
    @DeleteMapping("/{rateIds}")
    public AjaxResult remove(@PathVariable Long[] rateIds)
    {
        return toAjax(pmsExchangeRateService.deleteExchangeRateByIds(rateIds));
    }
}