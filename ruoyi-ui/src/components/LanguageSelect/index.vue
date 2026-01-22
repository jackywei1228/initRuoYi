<template>
  <el-dropdown class="right-menu-item hover-effect" trigger="click" @command="handleSetLanguage">
    <span class="language-link">
      <svg-icon icon-class="international" />
    </span>
    <el-dropdown-menu slot="dropdown">
      <el-dropdown-item command="zh" :disabled="language === 'zh'">
        {{ $t('language.zh') }}
      </el-dropdown-item>
      <el-dropdown-item command="en" :disabled="language === 'en'">
        {{ $t('language.en') }}
      </el-dropdown-item>
    </el-dropdown-menu>
  </el-dropdown>
</template>

<script>
import Cookies from 'js-cookie'
import { setLanguage } from '@/lang'

export default {
  name: 'LanguageSelect',
  data() {
    return {
      language: Cookies.get('language') || 'zh'
    }
  },
  methods: {
    async handleSetLanguage(lang) {
      if (this.language === lang) {
        return
      }
      this.language = lang
      await setLanguage(lang)
      this.$message.success(lang === 'zh' ? this.$t('language.switchToZh') : this.$t('language.switchToEn'))
      setTimeout(() => {
        window.location.reload()
      }, 300)
    }
  }
}
</script>

<style lang="scss" scoped>
.language-link {
  display: inline-flex;
  align-items: center;
  height: 100%;
}

.language-link .svg-icon {
  font-size: 18px;
}
</style>
