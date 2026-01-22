package com.ruoyi.web.controller.system;

import java.util.Map;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.ruoyi.common.annotation.Anonymous;
import com.ruoyi.common.core.domain.AjaxResult;
import com.ruoyi.system.service.ISysI18nService;

/**
 * 国际化资源接口
 */
@RestController
@RequestMapping("/system/i18n")
public class SysI18nController
{
    @Autowired
    private ISysI18nService sysI18nService;

    @Anonymous
    @GetMapping("/messages")
    public AjaxResult messages(String lang)
    {
        return AjaxResult.success(sysI18nService.selectI18nMap(lang));
    }
}
