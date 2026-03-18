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
      <el-form-item label="所属SPU" prop="bareboneId">
        <el-select v-model="queryParams.bareboneId" placeholder="请选择SPU" clearable filterable>
          <el-option
            v-for="item in bareboneOptions"
            :key="item.bareboneId"
            :label="item.modelName"
            :value="item.bareboneId"
          />
        </el-select>
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
          v-hasPermi="['pms:sku:add']"
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
          v-hasPermi="['pms:sku:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="info"
          plain
          icon="el-icon-s-data"
          size="mini"
          :disabled="multiple"
          @click="handleCompare"
          v-hasPermi="['pms:sku:list']"
        >SKU对比</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['pms:sku:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="skuList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="SKU编码" align="center" prop="skuCode" :show-overflow-tooltip="true" />
      <el-table-column label="所属SPU" align="center" prop="bareboneName" :show-overflow-tooltip="true" />
      <el-table-column label="配置描述" align="center" prop="configDesc" :show-overflow-tooltip="true" />
      <el-table-column label="配置加价(USD)" align="center" prop="addPrice" width="120">
        <template slot-scope="scope">
          <span>{{ scope.row.addPrice ? '$' + scope.row.addPrice.toFixed(2) : '$0.00' }}</span>
        </template>
      </el-table-column>
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
      <el-table-column label="创建时间" align="center" prop="createTime" width="160">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width" width="200">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-setting"
            @click="handleConfigAccessories(scope.row)"
            v-hasPermi="['pms:sku:edit']"
          >配置配件</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['pms:sku:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['pms:sku:remove']"
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

    <!-- 添加或修改SKU对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="600px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="所属SPU" prop="bareboneId">
          <el-select v-model="form.bareboneId" placeholder="请选择SPU" filterable @change="handleBareboneChange">
            <el-option
              v-for="item in bareboneOptions"
              :key="item.bareboneId"
              :label="item.modelName"
              :value="item.bareboneId"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="SKU编码" prop="skuCode">
          <el-input v-model="form.skuCode" placeholder="请输入SKU编码">
            <el-button slot="append" @click="generateSkuCode" :disabled="!form.bareboneId">自动生成</el-button>
          </el-input>
        </el-form-item>
        <el-form-item label="配置描述" prop="configDesc">
          <el-input v-model="form.configDesc" type="textarea" placeholder="请输入配置描述" />
        </el-form-item>
        <el-form-item label="配置加价" prop="addPrice">
          <el-input-number v-model="form.addPrice" :precision="2" :min="0" placeholder="自动计算或手动输入" />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="form.status">
            <el-radio
              v-for="dict in dict.type.sys_normal_disable"
              :key="dict.value"
              :label="dict.value"
            >{{ dict.label }}</el-radio>
          </el-radio-group>
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

    <!-- 配置配件对话框 -->
    <el-dialog title="配置配件" :visible.sync="accessoryOpen" width="900px" append-to-body>
      <el-alert title="选择配件后将自动计算配置加价" type="info" :closable="false" style="margin-bottom: 15px" />
      <el-table v-loading="accessoryLoading" :data="accessoryList" @selection-change="handleAccessorySelectionChange" ref="accessoryTable">
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="配件类型" align="center" prop="typeName" />
        <el-table-column label="配件值" align="center" prop="valueName" />
        <el-table-column label="规格描述" align="center" prop="specification" :show-overflow-tooltip="true" />
        <el-table-column label="加价(USD)" align="center" prop="addPrice">
          <template slot-scope="scope">
            <span>{{ scope.row.addPrice ? '$' + scope.row.addPrice.toFixed(2) : '$0.00' }}</span>
          </template>
        </el-table-column>
      </el-table>
      <div style="margin-top: 15px; text-align: right;">
        <span>选中配件加价合计: <b style="color: #409EFF; font-size: 18px;">${{ selectedAddPrice.toFixed(2) }}</b></span>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitAccessories">确 定</el-button>
        <el-button @click="accessoryOpen = false">取 消</el-button>
      </div>
    </el-dialog>

    <!-- SKU对比对话框 -->
    <el-dialog title="SKU对比" :visible.sync="compareOpen" width="90%" append-to-body>
      <el-table v-loading="compareLoading" :data="compareList" border>
        <el-table-column label="对比项" align="center" prop="fieldName" width="120" fixed />
        <el-table-column v-for="(item, index) in compareColumns" :key="index" :label="item.skuCode" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row['value' + index] }}</span>
          </template>
        </el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button @click="compareOpen = false">关 闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listSku, getSku, delSku, addSku, updateSku, listAccessories, updateAccessories, compare, generateCode } from "@/api/pms/sku"
import { listBarebone } from "@/api/pms/barebone"
import { listAccessoryValue } from "@/api/pms/accessoryValue"

export default {
  name: "Sku",
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
      // SKU表格数据
      skuList: [],
      // SPU选项
      bareboneOptions: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 配件配置弹出层
      accessoryOpen: false,
      accessoryLoading: false,
      accessoryList: [],
      selectedAccessories: [],
      selectedAddPrice: 0,
      currentSkuId: undefined,
      // SKU对比
      compareOpen: false,
      compareLoading: false,
      compareList: [],
      compareColumns: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        skuCode: undefined,
        bareboneId: undefined,
        status: undefined
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        bareboneId: [
          { required: true, message: "请选择SPU", trigger: "change" }
        ],
        skuCode: [
          { required: true, message: "SKU编码不能为空", trigger: "blur" }
        ]
      }
    }
  },
  created() {
    this.getList()
    this.getBareboneList()
  },
  methods: {
    /** 查询SPU列表 */
    getBareboneList() {
      listBarebone({ pageNum: 1, pageSize: 1000, status: '1' }).then(response => {
        this.bareboneOptions = response.rows
      })
    },
    /** 查询SKU列表 */
    getList() {
      this.loading = true
      listSku(this.queryParams).then(response => {
        this.skuList = response.rows
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
        skuId: undefined,
        bareboneId: undefined,
        skuCode: undefined,
        configDesc: undefined,
        addPrice: 0,
        status: "1",
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
      this.resetForm("queryForm")
      this.handleQuery()
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.skuId)
      this.single = selection.length !== 1
      this.multiple = !selection.length
    },
    /** SPU选择变化 */
    handleBareboneChange(val) {
      this.form.skuCode = ''
    },
    /** 自动生成SKU编码 */
    generateSkuCode() {
      if (!this.form.bareboneId) {
        this.$modal.msgWarning("请先选择SPU")
        return
      }
      generateCode(this.form.bareboneId).then(response => {
        this.form.skuCode = response.data
        this.$modal.msgSuccess("SKU编码生成成功")
      })
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset()
      this.open = true
      this.title = "添加SKU"
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset()
      const skuId = row.skuId || this.ids
      getSku(skuId).then(response => {
        this.form = response.data
        this.open = true
        this.title = "修改SKU"
      })
    },
    /** SKU状态修改 */
    handleStatusChange(row) {
      let text = row.status === "1" ? "启用" : "停用"
      this.$modal.confirm('确认要"' + text + '""' + row.skuCode + '"SKU吗？').then(function() {
        return updateSku({ skuId: row.skuId, status: row.status })
      }).then(() => {
        this.$modal.msgSuccess(text + "成功")
      }).catch(function() {
        row.status = row.status === "1" ? "0" : "1"
      })
    },
    /** 配置配件 */
    handleConfigAccessories(row) {
      this.currentSkuId = row.skuId
      this.selectedAddPrice = 0
      this.accessoryLoading = true
      this.accessoryOpen = true
      // 获取SPU关联的配件
      listAccessories(row.skuId).then(response => {
        this.accessoryList = response.data.accessories || []
        const selectedIds = response.data.selectedIds || []
        this.$nextTick(() => {
          this.accessoryList.forEach(item => {
            if (selectedIds.includes(item.valueId)) {
              this.$refs.accessoryTable && this.$refs.accessoryTable.toggleRowSelection(item, true)
            }
          })
        })
        this.accessoryLoading = false
      })
    },
    // 配件选择变化
    handleAccessorySelectionChange(selection) {
      this.selectedAccessories = selection
      this.selectedAddPrice = selection.reduce((sum, item) => sum + (item.addPrice || 0), 0)
    },
    // 提交配件配置
    submitAccessories() {
      const valueIds = this.selectedAccessories.map(item => item.valueId)
      updateAccessories(this.currentSkuId, valueIds).then(response => {
        this.$modal.msgSuccess("配件配置成功")
        this.accessoryOpen = false
        this.getList()
      })
    },
    /** SKU对比 */
    handleCompare() {
      if (this.ids.length < 2) {
        this.$modal.msgWarning("请至少选择2个SKU进行对比")
        return
      }
      this.compareLoading = true
      this.compareOpen = true
      compare(this.ids).then(response => {
        this.compareList = response.data.rows
        this.compareColumns = response.data.columns
        this.compareLoading = false
      })
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.skuId != undefined) {
            updateSku(this.form).then(response => {
              this.$modal.msgSuccess("修改成功")
              this.open = false
              this.getList()
            })
          } else {
            addSku(this.form).then(response => {
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
      const skuIds = row.skuId || this.ids
      this.$modal.confirm('是否确认删除SKU编号为"' + skuIds + '"的数据项？').then(function() {
        return delSku(skuIds)
      }).then(() => {
        this.getList()
        this.$modal.msgSuccess("删除成功")
      }).catch(() => {})
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('pms/sku/export', {
        ...this.queryParams
      }, `sku_${new Date().getTime()}.xlsx`)
    }
  }
}
</script>