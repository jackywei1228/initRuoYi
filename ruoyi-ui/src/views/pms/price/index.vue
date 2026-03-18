<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="88px">
      <el-form-item label="SKU编码" prop="skuCode">
        <el-input
          v-model="queryParams.skuCode"
          placeholder="请输入SKU编码"
          clearable
          @keyup.enter.native="handleQuery"
        />
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
      <el-form-item label="状态" prop="status">
        <el-select v-model="queryParams.status" placeholder="状态" clearable>
          <el-option
            v-for="dict in dict.type.sys_normal_disable"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
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
          v-hasPermi="['pms:price:add']"
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
          v-hasPermi="['pms:price:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['pms:price:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="priceList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="SKU编码" align="center" prop="skuCode" width="150" :show-overflow-tooltip="true" />
      <el-table-column label="供应商基础价(USD)" align="center" prop="supplierBasePrice" width="130">
        <template slot-scope="scope">
          <span>{{ scope.row.supplierBasePrice ? '$' + scope.row.supplierBasePrice.toFixed(2) : '$0.00' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="汇率" align="center" prop="exchangeRate" width="80">
        <template slot-scope="scope">
          <span>{{ scope.row.exchangeRate ? scope.row.exchangeRate.toFixed(4) : '0.0000' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Total Cost(AUD)" align="center" prop="totalCost" width="120">
        <template slot-scope="scope">
          <span>{{ scope.row.totalCost ? '$' + scope.row.totalCost.toFixed(2) : '$0.00' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="DBP ex(AUD)" align="center" prop="dbpEx" width="100">
        <template slot-scope="scope">
          <span>{{ scope.row.dbpEx ? '$' + scope.row.dbpEx.toFixed(2) : '$0.00' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Profit(AUD)" align="center" prop="profit" width="100">
        <template slot-scope="scope">
          <span>{{ scope.row.profit ? '$' + scope.row.profit.toFixed(2) : '$0.00' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="RRP inc(AUD)" align="center" prop="rrpInc" width="100">
        <template slot-scope="scope">
          <span>{{ scope.row.rrpInc ? '$' + scope.row.rrpInc.toFixed(2) : '$0.00' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Build Margin(%)" align="center" prop="buildMargin" width="110">
        <template slot-scope="scope">
          <span :style="{ color: scope.row.buildMargin < 0 ? 'red' : 'green' }">
            {{ scope.row.buildMargin ? scope.row.buildMargin.toFixed(2) + '%' : '0.00%' }}
          </span>
        </template>
      </el-table-column>
      <el-table-column label="RRP Margin(%)" align="center" prop="rrpMargin" width="100">
        <template slot-scope="scope">
          <span :style="{ color: scope.row.rrpMargin < 0 ? 'red' : 'green' }">
            {{ scope.row.rrpMargin ? scope.row.rrpMargin.toFixed(2) + '%' : '0.00%' }}
          </span>
        </template>
      </el-table-column>
      <el-table-column label="生效日期" align="center" prop="effectiveDate" width="100" />
      <el-table-column label="状态" align="center" prop="status">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.status"
            active-value="1"
            inactive-value="0"
            @change="handleStatusChange(scope.row)"
          ></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width" width="150" fixed="right">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['pms:price:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-time"
            @click="handleHistory(scope.row)"
            v-hasPermi="['pms:price:list']"
          >历史</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['pms:price:remove']"
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

    <!-- 添加或修改价格对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="900px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="140px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="SKU" prop="skuId">
              <el-select v-model="form.skuId" placeholder="请选择SKU" filterable @change="handleSkuChange">
                <el-option
                  v-for="item in skuOptions"
                  :key="item.skuId"
                  :label="item.skuCode"
                  :value="item.skuId"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="生效日期" prop="effectiveDate">
              <el-date-picker
                v-model="form.effectiveDate"
                type="date"
                placeholder="选择生效日期"
                value-format="yyyy-MM-dd"
              />
            </el-form-item>
          </el-col>
        </el-row>

        <el-divider content-position="left">基础价格设置</el-divider>
        <el-row>
          <el-col :span="12">
            <el-form-item label="供应商基础价(USD)" prop="supplierBasePrice">
              <el-input-number v-model="form.supplierBasePrice" :precision="2" :min="0" @change="calculatePrice" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="汇率" prop="exchangeRate">
              <el-input-number v-model="form.exchangeRate" :precision="4" :min="0" :step="0.0001" @change="calculatePrice" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-divider content-position="left">费用设置</el-divider>
        <el-row>
          <el-col :span="8">
            <el-form-item label="Freight(USD)" prop="freightUsd">
              <el-input-number v-model="form.freightUsd" :precision="2" :min="0" @change="calculatePrice" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="Advertising" prop="advertising">
              <el-input-number v-model="form.advertising" :precision="2" :min="0" @change="calculatePrice" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="Build" prop="build">
              <el-input-number v-model="form.build" :precision="2" :min="0" @change="calculatePrice" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="Warranty" prop="warranty">
              <el-input-number v-model="form.warranty" :precision="2" :min="0" @change="calculatePrice" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="Freight AU" prop="freightAu">
              <el-input-number v-model="form.freightAu" :precision="2" :min="0" @change="calculatePrice" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-divider content-position="left">销售价格设置</el-divider>
        <el-row>
          <el-col :span="8">
            <el-form-item label="DBP ex(AUD)" prop="dbpEx">
              <el-input-number v-model="form.dbpEx" :precision="2" :min="0" @change="calculatePrice" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="RRP inc(AUD)" prop="rrpInc">
              <el-input-number v-model="form.rrpInc" :precision="2" :min="0" @change="calculatePrice" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-divider content-position="left">计算结果</el-divider>
        <el-row>
          <el-col :span="8">
            <el-form-item label="Total Cost(AUD)">
              <span style="font-size: 18px; font-weight: bold; color: #409EFF;">${{ calculatedResult.totalCost.toFixed(2) }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="Profit(AUD)">
              <span style="font-size: 18px; font-weight: bold;" :style="{ color: calculatedResult.profit >= 0 ? '#67C23A' : '#F56C6C' }">${{ calculatedResult.profit.toFixed(2) }}</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="Build Margin(%)">
              <span style="font-size: 18px; font-weight: bold;" :style="{ color: calculatedResult.buildMargin >= 0 ? '#67C23A' : '#F56C6C' }">{{ calculatedResult.buildMargin.toFixed(2) }}%</span>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="RRP Margin(%)">
              <span style="font-size: 18px; font-weight: bold;" :style="{ color: calculatedResult.rrpMargin >= 0 ? '#67C23A' : '#F56C6C' }">{{ calculatedResult.rrpMargin.toFixed(2) }}%</span>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="12">
            <el-form-item label="状态" prop="status">
              <el-radio-group v-model="form.status">
                <el-radio
                  v-for="dict in dict.type.sys_normal_disable"
                  :key="dict.value"
                  :label="dict.value"
                >{{ dict.label }}</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="备注" prop="remark">
              <el-input v-model="form.remark" type="textarea" placeholder="请输入备注" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>

    <!-- 价格历史对话框 -->
    <el-dialog title="价格变更历史" :visible.sync="historyOpen" width="900px" append-to-body>
      <el-table v-loading="historyLoading" :data="historyList" border>
        <el-table-column label="生效日期" align="center" prop="effectiveDate" width="100" />
        <el-table-column label="基础价(USD)" align="center" prop="supplierBasePrice">
          <template slot-scope="scope">
            <span>${{ scope.row.supplierBasePrice ? scope.row.supplierBasePrice.toFixed(2) : '0.00' }}</span>
          </template>
        </el-table-column>
        <el-table-column label="汇率" align="center" prop="exchangeRate">
          <template slot-scope="scope">
            <span>{{ scope.row.exchangeRate ? scope.row.exchangeRate.toFixed(4) : '0.0000' }}</span>
          </template>
        </el-table-column>
        <el-table-column label="Total Cost" align="center" prop="totalCost">
          <template slot-scope="scope">
            <span>${{ scope.row.totalCost ? scope.row.totalCost.toFixed(2) : '0.00' }}</span>
          </template>
        </el-table-column>
        <el-table-column label="DBP ex" align="center" prop="dbpEx">
          <template slot-scope="scope">
            <span>${{ scope.row.dbpEx ? scope.row.dbpEx.toFixed(2) : '0.00' }}</span>
          </template>
        </el-table-column>
        <el-table-column label="RRP inc" align="center" prop="rrpInc">
          <template slot-scope="scope">
            <span>${{ scope.row.rrpInc ? scope.row.rrpInc.toFixed(2) : '0.00' }}</span>
          </template>
        </el-table-column>
        <el-table-column label="Build Margin" align="center" prop="buildMargin">
          <template slot-scope="scope">
            <span>{{ scope.row.buildMargin ? scope.row.buildMargin.toFixed(2) : '0.00' }}%</span>
          </template>
        </el-table-column>
        <el-table-column label="创建时间" align="center" prop="createTime" width="160">
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.createTime) }}</span>
          </template>
        </el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button @click="historyOpen = false">关 闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listPrice, getPrice, delPrice, addPrice, updatePrice, calculate, getHistory } from "@/api/pms/price"
import { listSku } from "@/api/pms/sku"

export default {
  name: "Price",
  dicts: ['sys_normal_disable'],
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
      // 价格表格数据
      priceList: [],
      // SKU选项
      skuOptions: [],
      // 日期范围
      dateRange: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 历史记录
      historyOpen: false,
      historyLoading: false,
      historyList: [],
      // 计算结果
      calculatedResult: {
        totalCost: 0,
        profit: 0,
        buildMargin: 0,
        rrpMargin: 0
      },
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        skuCode: undefined,
        status: undefined
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        skuId: [
          { required: true, message: "请选择SKU", trigger: "change" }
        ],
        supplierBasePrice: [
          { required: true, message: "供应商基础价不能为空", trigger: "blur" }
        ],
        exchangeRate: [
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
    this.getSkuList()
  },
  methods: {
    /** 查询SKU列表 */
    getSkuList() {
      listSku({ pageNum: 1, pageSize: 1000, status: '1' }).then(response => {
        this.skuOptions = response.rows
      })
    },
    /** 查询价格列表 */
    getList() {
      this.loading = true
      listPrice(this.addDateRange(this.queryParams, this.dateRange)).then(response => {
        this.priceList = response.rows
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
        priceId: undefined,
        skuId: undefined,
        supplierBasePrice: 0,
        exchangeRate: 1.5,
        freightUsd: 0,
        advertising: 0,
        build: 0,
        warranty: 0,
        freightAu: 0,
        dbpEx: 0,
        rrpInc: 0,
        effectiveDate: undefined,
        status: "1",
        remark: undefined
      }
      this.calculatedResult = {
        totalCost: 0,
        profit: 0,
        buildMargin: 0,
        rrpMargin: 0
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
      this.ids = selection.map(item => item.priceId)
      this.single = selection.length !== 1
      this.multiple = !selection.length
    },
    /** SKU选择变化 */
    handleSkuChange(val) {
      // 可以在此加载SKU的基础价格等信息
    },
    /** 计算价格 */
    calculatePrice() {
      if (this.form.supplierBasePrice && this.form.exchangeRate) {
        calculate(this.form).then(response => {
          this.calculatedResult = response.data
        })
      }
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset()
      this.open = true
      this.title = "添加价格"
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset()
      const priceId = row.priceId || this.ids
      getPrice(priceId).then(response => {
        this.form = response.data
        this.calculatedResult = {
          totalCost: response.data.totalCost || 0,
          profit: response.data.profit || 0,
          buildMargin: response.data.buildMargin || 0,
          rrpMargin: response.data.rrpMargin || 0
        }
        this.open = true
        this.title = "修改价格"
      })
    },
    /** 价格状态修改 */
    handleStatusChange(row) {
      let text = row.status === "1" ? "启用" : "停用"
      this.$modal.confirm('确认要"' + text + '"该价格记录吗？').then(function() {
        return updatePrice({ priceId: row.priceId, status: row.status })
      }).then(() => {
        this.$modal.msgSuccess(text + "成功")
      }).catch(function() {
        row.status = row.status === "1" ? "0" : "1"
      })
    },
    /** 查看历史记录 */
    handleHistory(row) {
      this.historyLoading = true
      this.historyOpen = true
      getHistory(row.priceId).then(response => {
        this.historyList = response.data
        this.historyLoading = false
      })
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          // 先计算价格
          this.form.totalCost = this.calculatedResult.totalCost
          this.form.profit = this.calculatedResult.profit
          this.form.buildMargin = this.calculatedResult.buildMargin
          this.form.rrpMargin = this.calculatedResult.rrpMargin

          if (this.form.priceId != undefined) {
            updatePrice(this.form).then(response => {
              this.$modal.msgSuccess("修改成功")
              this.open = false
              this.getList()
            })
          } else {
            addPrice(this.form).then(response => {
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
      const priceIds = row.priceId || this.ids
      this.$modal.confirm('是否确认删除价格编号为"' + priceIds + '"的数据项？').then(function() {
        return delPrice(priceIds)
      }).then(() => {
        this.getList()
        this.$modal.msgSuccess("删除成功")
      }).catch(() => {})
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('pms/price/export', {
        ...this.queryParams
      }, `price_${new Date().getTime()}.xlsx`)
    }
  }
}
</script>