<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="88px">
      <el-form-item label="货币对" prop="currencyPair">
        <el-select v-model="queryParams.currencyPair" placeholder="请选择货币对" clearable>
          <el-option
            v-for="item in currencyPairOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="生效日期">
        <el-date-picker
          v-model="dateRange"
          style="width: 240px"
          value-format="yyyy-MM-dd"
          type="daterange"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        ></el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['pms:exchangeRate:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['pms:exchangeRate:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['pms:exchangeRate:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="rateList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="货币对" align="center" prop="currencyPair" />
      <el-table-column label="汇率" align="center" prop="rate">
        <template slot-scope="scope">
          <span>{{ scope.row.rate ? scope.row.rate.toFixed(4) : '0.0000' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="生效日期" align="center" prop="effectiveDate" width="120" />
      <el-table-column label="是否启用" align="center" prop="isEnabled">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.isEnabled"
            :active-value="1"
            :inactive-value="0"
            @change="handleEnableChange(scope.row)"
          ></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" align="center" prop="createTime" width="160">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width" width="150">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['pms:exchangeRate:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['pms:exchangeRate:remove']"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 添加或修改汇率对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="货币对" prop="currencyPair">
          <el-select v-model="form.currencyPair" placeholder="请选择货币对">
            <el-option
              v-for="item in currencyPairOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="汇率" prop="rate">
          <el-input-number v-model="form.rate" :precision="4" :min="0" :step="0.0001" placeholder="请输入汇率" />
        </el-form-item>
        <el-form-item label="生效日期" prop="effectiveDate">
          <el-date-picker
            v-model="form.effectiveDate"
            type="date"
            placeholder="选择生效日期"
            value-format="yyyy-MM-dd"
          />
        </el-form-item>
        <el-form-item label="是否启用" prop="isEnabled">
          <el-switch v-model="form.isEnabled" :active-value="1" :inactive-value="0"></el-switch>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="form.remark" type="textarea" placeholder="请输入备注" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listExchangeRate, getExchangeRate, delExchangeRate, addExchangeRate, updateExchangeRate } from "@/api/pms/exchangeRate"

export default {
  name: "ExchangeRate",
  data() {
    return {
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 汇率表格数据
      rateList: [],
      // 日期范围
      dateRange: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 货币对选项
      currencyPairOptions: [
        { value: 'USD/AUD', label: 'USD/AUD (美元兑澳元)' },
        { value: 'AUD/USD', label: 'AUD/USD (澳元兑美元)' },
        { value: 'USD/CNY', label: 'USD/CNY (美元兑人民币)' },
        { value: 'CNY/USD', label: 'CNY/USD (人民币兑美元)' },
        { value: 'AUD/CNY', label: 'AUD/CNY (澳元兑人民币)' },
        { value: 'CNY/AUD', label: 'CNY/AUD (人民币兑澳元)' }
      ],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        currencyPair: undefined
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        currencyPair: [
          { required: true, message: "请选择货币对", trigger: "change" }
        ],
        rate: [
          { required: true, message: "汇率不能为空", trigger: "blur" }
        ],
        effectiveDate: [
          { required: true, message: "请选择生效日期", trigger: "change" }
        ]
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    /** 查询汇率列表 */
    getList() {
      this.loading = true
      listExchangeRate(this.addDateRange(this.queryParams, this.dateRange)).then(response => {
        this.rateList = response.rows
        this.total = response.total
        this.loading = false
      })
    },
    // 取消按钮
    cancel() {
      this.open = false
      this.reset()
    },
    // 表单重置
    reset() {
      this.form = {
        rateId: undefined,
        currencyPair: undefined,
        rate: undefined,
        effectiveDate: undefined,
        isEnabled: 1,
        remark: undefined
      }
      this.resetForm("form")
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1
      this.getList()
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.dateRange = []
      this.resetForm("queryForm")
      this.handleQuery()
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.rateId)
      this.single = selection.length !== 1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset()
      this.open = true
      this.title = "添加汇率"
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset()
      const rateId = row.rateId || this.ids
      getExchangeRate(rateId).then(response => {
        this.form = response.data
        this.open = true
        this.title = "修改汇率"
      })
    },
    /** 汇率启用状态修改 */
    handleEnableChange(row) {
      let text = row.isEnabled === 1 ? "启用" : "停用"
      this.$modal.confirm('确认要"' + text + '""' + row.currencyPair + '"汇率吗？').then(function() {
        return updateExchangeRate({ rateId: row.rateId, isEnabled: row.isEnabled })
      }).then(() => {
        this.$modal.msgSuccess(text + "成功")
      }).catch(function() {
        row.isEnabled = row.isEnabled === 1 ? 0 : 1
      })
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.rateId != undefined) {
            updateExchangeRate(this.form).then(response => {
              this.$modal.msgSuccess("修改成功")
              this.open = false
              this.getList()
            })
          } else {
            addExchangeRate(this.form).then(response => {
              this.$modal.msgSuccess("新增成功")
              this.open = false
              this.getList()
            })
          }
        }
      })
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const rateIds = row.rateId || this.ids
      this.$modal.confirm('是否确认删除汇率编号为"' + rateIds + '"的数据项？').then(function() {
        return delExchangeRate(rateIds)
      }).then(() => {
        this.getList()
        this.$modal.msgSuccess("删除成功")
      }).catch(() => {})
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('pms/exchangeRate/export', {
        ...this.queryParams
      }, `exchangeRate_${new Date().getTime()}.xlsx`)
    }
  }
}
</script>