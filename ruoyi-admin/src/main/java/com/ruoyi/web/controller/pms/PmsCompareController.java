package com.ruoyi.web.controller.pms;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.ruoyi.common.core.controller.BaseController;
import com.ruoyi.common.core.domain.AjaxResult;
import com.ruoyi.system.pms.domain.PmsBarebone;
import com.ruoyi.system.pms.domain.PmsSku;
import com.ruoyi.system.pms.service.IPmsBareboneService;
import com.ruoyi.system.pms.service.IPmsSkuService;

/**
 * 产品比较Controller
 *
 * @author ruoyi
 */
@RestController
@RequestMapping("/pms/compare")
public class PmsCompareController extends BaseController
{
    @Autowired
    private IPmsBareboneService bareboneService;

    @Autowired
    private IPmsSkuService skuService;

    /**
     * 比较基础型号
     */
    @PreAuthorize("@ss.hasPermi('pms:compare:barebone')")
    @PostMapping("/barebone")
    public AjaxResult compareBarebone(@RequestBody Long[] bareboneIds)
    {
        return success(bareboneService.compareBarebones(bareboneIds));
    }

    /**
     * 比较SKU
     */
    @PreAuthorize("@ss.hasPermi('pms:compare:sku')")
    @PostMapping("/sku")
    public AjaxResult compareSku(@RequestBody Long[] skuIds)
    {
        return success(skuService.compareSkus(skuIds));
    }
}