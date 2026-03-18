package com.ruoyi.web.controller.pms;

import java.util.List;
import javax.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.ruoyi.common.annotation.Log;
import com.ruoyi.common.core.controller.BaseController;
import com.ruoyi.common.core.domain.AjaxResult;
import com.ruoyi.common.core.page.TableDataInfo;
import com.ruoyi.common.enums.BusinessType;
import com.ruoyi.common.utils.poi.ExcelUtil;
import com.ruoyi.system.pms.domain.PmsPriceDetail;
import com.ruoyi.system.pms.domain.PmsPriceHistory;
import com.ruoyi.system.pms.domain.PmsPriceMain;
import com.ruoyi.system.pms.service.IPmsPriceHistoryService;
import com.ruoyi.system.pms.service.IPmsPriceMainService;

/**
 * 价格管理Controller
 *
 * @author ruoyi
 */
@RestController
@RequestMapping("/pms/price")
public class PmsPriceController extends BaseController
{
    @Autowired
    private IPmsPriceMainService pmsPriceMainService;

    @Autowired
    private IPmsPriceHistoryService pmsPriceHistoryService;

    /**
     * 查询价格列表
     */
    @PreAuthorize("@ss.hasPermi('pms:price:list')")
    @GetMapping("/list")
    public TableDataInfo list(PmsPriceMain pmsPriceMain)
    {
        startPage();
        List<PmsPriceMain> list = pmsPriceMainService.selectPriceMainList(pmsPriceMain);
        return getDataTable(list);
    }

    /**
     * 导出价格列表
     */
    @PreAuthorize("@ss.hasPermi('pms:price:export')")
    @Log(title = "价格管理", businessType = BusinessType.EXPORT)
    @PostMapping("/export")
    public void export(HttpServletResponse response, PmsPriceMain pmsPriceMain)
    {
        List<PmsPriceMain> list = pmsPriceMainService.selectPriceMainList(pmsPriceMain);
        ExcelUtil<PmsPriceMain> util = new ExcelUtil<PmsPriceMain>(PmsPriceMain.class);
        util.exportExcel(response, list, "价格数据");
    }

    /**
     * 获取价格详细信息
     */
    @PreAuthorize("@ss.hasPermi('pms:price:query')")
    @GetMapping(value = "/{priceId}")
    public AjaxResult getInfo(@PathVariable("priceId") Long priceId)
    {
        return success(pmsPriceMainService.selectPriceMainById(priceId));
    }

    /**
     * 新增价格
     */
    @PreAuthorize("@ss.hasPermi('pms:price:add')")
    @Log(title = "价格管理", businessType = BusinessType.INSERT)
    @PostMapping
    public AjaxResult add(@Validated @RequestBody PmsPriceMain pmsPriceMain)
    {
        pmsPriceMain.setCreateBy(getUsername());
        return toAjax(pmsPriceMainService.insertPriceMain(pmsPriceMain));
    }

    /**
     * 修改价格
     */
    @PreAuthorize("@ss.hasPermi('pms:price:edit')")
    @Log(title = "价格管理", businessType = BusinessType.UPDATE)
    @PutMapping
    public AjaxResult edit(@Validated @RequestBody PmsPriceMain pmsPriceMain)
    {
        pmsPriceMain.setUpdateBy(getUsername());
        return toAjax(pmsPriceMainService.updatePriceMain(pmsPriceMain));
    }

    /**
     * 删除价格
     */
    @PreAuthorize("@ss.hasPermi('pms:price:remove')")
    @Log(title = "价格管理", businessType = BusinessType.DELETE)
    @DeleteMapping("/{priceIds}")
    public AjaxResult remove(@PathVariable Long[] priceIds)
    {
        return toAjax(pmsPriceMainService.deletePriceMainByIds(priceIds));
    }

    /**
     * 计算价格
     */
    @PreAuthorize("@ss.hasPermi('pms:price:edit')")
    @PostMapping("/calculate")
    public AjaxResult calculate(@RequestBody PriceCalculateRequest request)
    {
        pmsPriceMainService.calculatePrice(request.getPrice(), request.getDetails());
        return success(request.getPrice());
    }

    /**
     * 获取价格历史
     */
    @PreAuthorize("@ss.hasPermi('pms:price:query')")
    @GetMapping("/history/{priceId}")
    public AjaxResult getHistory(@PathVariable("priceId") Long priceId)
    {
        List<PmsPriceHistory> historyList = pmsPriceHistoryService.getByPriceId(priceId);
        return success(historyList);
    }

    /**
     * 根据SKU ID获取价格列表
     */
    @PreAuthorize("@ss.hasPermi('pms:price:query')")
    @GetMapping("/bySku/{skuId}")
    public AjaxResult getBySkuId(@PathVariable("skuId") Long skuId)
    {
        return success(pmsPriceMainService.getBySkuId(skuId));
    }

    /**
     * 价格计算请求对象
     */
    public static class PriceCalculateRequest
    {
        private PmsPriceMain price;
        private List<PmsPriceDetail> details;

        public PmsPriceMain getPrice()
        {
            return price;
        }

        public void setPrice(PmsPriceMain price)
        {
            this.price = price;
        }

        public List<PmsPriceDetail> getDetails()
        {
            return details;
        }

        public void setDetails(List<PmsPriceDetail> details)
        {
            this.details = details;
        }
    }
}