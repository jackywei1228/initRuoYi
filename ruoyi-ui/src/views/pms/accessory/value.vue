<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="88px">
      <el-form-item label="所属类型" prop="typeId">
        <el-select v-model="queryParams.typeId" placeholder="请选择配件类型" clearable>
          <el-option
            v-for="item in typeOptions"
            :key="item.typeId"
            :label="item.typeName"
            :value="item.typeId"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="配置值名称" prop="valueName">
        <el-input
          v-model="queryParams.valueName"
          placeholder="请输入配置值名称"
          clearable
          @keyup.enter.native="handleQuery"
        />
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
          v-hasPermi="['pms:accessoryValue:add']"
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
          v-hasPermi="['pms:accessoryValue:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['pms:accessoryValue:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="valueList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="所属类型" align="center" prop="typeName" />
      <el-table-column label="配置值名称" align="center" prop="valueName" />
      <el-table-column label="规格描述" align="center" prop="specification" :show-overflow-tooltip="true" />
      <el-table-column label="加价(USD)" align="center" prop="addPrice" width="100">
        <template slot-scope="scope">
          <span>{{ scope.row.addPrice ? '$' + scope.row.addPrice.toFixed(2) : '$0.00' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="排序" align="center" prop="sort" width="80" />
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
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width" width="150">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['pms:accessoryValue:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['pms:accessoryValue:remove']"
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

    <!-- 添加或修改配件值对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="所属类型" prop="typeId">
          <el-select v-model="form.typeId" placeholder="请选择配件类型">
            <el-option
              v-for="item in typeOptions"
              :key="item.typeId"
              :label="item.typeName"
              :value="item.typeId"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="配置值名称" prop="valueName">
          <el-input v-model="form.valueName" placeholder="请输入配置值名称" />
        </el-form-item>
        <el-form-item label="规格描述" prop="specification">
          <el-input v-model="form.specification" type="textarea" placeholder="请输入规格描述" />
        </el-form-item>
        <el-form-item label="加价(USD)" prop="addPrice">
          <el-input-number v-model="form.addPrice" :precision="2" :min="0" placeholder="加价金额" />
        </el-form-item>
        <el-form-item label="排序" prop="sort">
          <el-input-number v-model="form.sort" controls-position="right" :min="0" />
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
  </div>
</template>

<script>
import { listAccessoryValue, getAccessoryValue, delAccessoryValue, addAccessoryValue, updateAccessoryValue } from "@/api/pms/accessoryValue"
import { listAccessoryType } from "@/api/pms/accessoryType"

export default {
  name: "AccessoryValue",
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
      // 配件值表格数据
      valueList: [],
      // 配件类型选项
      typeOptions: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        typeId: undefined,
        valueName: undefined,
        status: undefined
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        typeId: [
          { required: true, message: "请选择配件类型", trigger: "change" }
        ],
        valueName: [
          { required: true, message: "配置值名称不能为空", trigger: "blur" }
        ]
      }
    }
  },
  created() {
    this.getList()
    this.getTypeList()
  },
  methods: {
    /** 查询配件类型列表 */
    getTypeList() {
      listAccessoryType({ pageNum: 1, pageSize: 1000, status: '1' }).then(response => {
        this.typeOptions = response.rows
      })
    },
    /** 查询配件值列表 */
    getList() {
      this.loading = true
      listAccessoryValue(this.queryParams).then(response => {
        this.valueList = response.rows
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
        valueId: undefined,
        typeId: undefined,
        valueName: undefined,
        specification: undefined,
        addPrice: 0,
        sort: 0,
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
      this.ids = selection.map(item => item.valueId)
      this.single = selection.length !== 1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset()
      this.open = true
      this.title = "添加配件值"
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset()
      const valueId = row.valueId || this.ids
      getAccessoryValue(valueId).then(response => {
        this.form = response.data
        this.open = true
        this.title = "修改配件值"
      })
    },
    /** 配件值状态修改 */
    handleStatusChange(row) {
      let text = row.status === "1" ? "启用" : "停用"
      this.$modal.confirm('确认要"' + text + '""' + row.valueName + '"配件值吗？').then(function() {
        return updateAccessoryValue({ valueId: row.valueId, status: row.status })
      }).then(() => {
        this.$modal.msgSuccess(text + "成功")
      }).catch(function() {
        row.status = row.status === "1" ? "0" : "1"
      })
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.valueId != undefined) {
            updateAccessoryValue(this.form).then(response => {
              this.$modal.msgSuccess("修改成功")
              this.open = false
              this.getList()
            })
          } else {
            addAccessoryValue(this.form).then(response => {
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
      const valueIds = row.valueId || this.ids
      this.$modal.confirm('是否确认删除配件值编号为"' + valueIds + '"的数据项？').then(function() {
        return delAccessoryValue(valueIds)
      }).then(() => {
        this.getList()
        this.$modal.msgSuccess("删除成功")
      }).catch(() => {})
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('pms/accessory/value/export', {
        ...this.queryParams
      }, `accessory_value_${new Date().getTime()}.xlsx`)
    }
  }
}
</script>