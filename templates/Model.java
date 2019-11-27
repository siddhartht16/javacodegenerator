<% if (classObject) { %>

package <%= classObject.packageName %>.models;

import com.fasterxml.jackson.annotation.JsonIgnore;
import javax.persistence.*;
import java.util.*;

@Entity
<%= classObject.accessModifier %> class <%= classObject.className %> {

    <%- classObject.defaultConstructor %>

    <%- classObject.paramConstructor %>

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    <%- classObject.fields %>

    <%- classObject.relatedFields %>

    <%- classObject.fieldsGetSetMethods %>

    <%- classObject.relatedFieldsMethods %>

    <%- classObject.methods %>

}
            <% } %>
